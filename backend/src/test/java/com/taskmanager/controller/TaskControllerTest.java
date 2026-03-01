package com.taskmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TaskService taskService;

    @Test
    void assignTask_returnsOkWithAssigneeAndInProgress() throws Exception {
        Task assigned = Task.builder()
                .id(1L)
                .title("Test task")
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.IN_PROGRESS)
                .assignee("alice")
                .build();

        when(taskService.assignTask(1L, "alice")).thenReturn(assigned);

        mockMvc.perform(patch("/api/tasks/1/assign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("assignee", "alice"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assignee").value("alice"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    void assignTask_closedTask_returns409() throws Exception {
        when(taskService.assignTask(anyLong(), anyString()))
                .thenThrow(new IllegalStateException("Cannot assign a closed task"));

        mockMvc.perform(patch("/api/tasks/1/assign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("assignee", "alice"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Cannot assign a closed task"));
    }

    @Test
    void unassignTask_returnsOkWithNullAssigneeAndOpen() throws Exception {
        Task unassigned = Task.builder()
                .id(1L)
                .title("Test task")
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.OPEN)
                .assignee(null)
                .build();

        when(taskService.unassignTask(1L)).thenReturn(unassigned);

        mockMvc.perform(patch("/api/tasks/1/unassign"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assignee").isEmpty())
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    void closeTask_returnsOkWithClosedStatus() throws Exception {
        Task closed = Task.builder()
                .id(1L)
                .title("Test task")
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.CLOSED)
                .build();

        when(taskService.closeTask(1L)).thenReturn(closed);

        mockMvc.perform(patch("/api/tasks/1/close"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CLOSED"));
    }

    @Test
    void closeTask_alreadyClosed_returns409() throws Exception {
        when(taskService.closeTask(anyLong()))
                .thenThrow(new IllegalStateException("Task is already closed"));

        mockMvc.perform(patch("/api/tasks/1/close"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Task is already closed"));
    }
}
