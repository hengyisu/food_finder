package com.example.iac.controller;

import com.example.iac.entity.IacVmClusterMapping;
import com.example.iac.entity.IacVmClusterMappingId;
import com.example.iac.repository.IacVmClusterMappingRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class IacVmClusterMappingControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IacVmClusterMappingRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String BASE_URL = "/api/iac-vm-cluster-mappings";

    @BeforeEach
    void setUp() {
        repository.deleteAll();

        IacVmClusterMapping mapping1 = new IacVmClusterMapping();
        mapping1.setId(new IacVmClusterMappingId("FAB1", "PHASE1"));
        mapping1.setFz("FZ1");
        mapping1.setCluster("CLUSTER1");
        repository.save(mapping1);

        IacVmClusterMapping mapping2 = new IacVmClusterMapping();
        mapping2.setId(new IacVmClusterMappingId("FAB2", "PHASE2"));
        mapping2.setFz("FZ2");
        mapping2.setCluster("CLUSTER2");
        repository.save(mapping2);
    }

    @Test
    void getAll_ShouldReturn200WithList() throws Exception {
        mockMvc.perform(get(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].fz", containsInAnyOrder("FZ1", "FZ2")))
                .andExpect(jsonPath("$[*].cluster", containsInAnyOrder("CLUSTER1", "CLUSTER2")));
    }

    @Test
    void getAll_WhenEmpty_ShouldReturn200WithEmptyList() throws Exception {
        repository.deleteAll();

        mockMvc.perform(get(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getById_WhenExists_ShouldReturn200WithEntity() throws Exception {
        mockMvc.perform(get(BASE_URL + "/FAB1/PHASE1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id.fab", is("FAB1")))
                .andExpect(jsonPath("$.id.phase", is("PHASE1")))
                .andExpect(jsonPath("$.fz", is("FZ1")))
                .andExpect(jsonPath("$.cluster", is("CLUSTER1")));
    }

    @Test
    void getById_WhenNotExists_ShouldReturn404() throws Exception {
        mockMvc.perform(get(BASE_URL + "/NOTEXIST/NOTEXIST")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_WhenValidPayload_ShouldReturn201WithCreatedEntity() throws Exception {
        IacVmClusterMapping newMapping = new IacVmClusterMapping();
        newMapping.setId(new IacVmClusterMappingId("FAB3", "PHASE3"));
        newMapping.setFz("FZ3");
        newMapping.setCluster("CLUSTER3");

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMapping)))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id.fab", is("FAB3")))
                .andExpect(jsonPath("$.id.phase", is("PHASE3")))
                .andExpect(jsonPath("$.fz", is("FZ3")))
                .andExpect(jsonPath("$.cluster", is("CLUSTER3")));
    }

    @Test
    void create_WhenDuplicateKey_ShouldReturn409() throws Exception {
        IacVmClusterMapping duplicate = new IacVmClusterMapping();
        duplicate.setId(new IacVmClusterMappingId("FAB1", "PHASE1"));
        duplicate.setFz("FZ_DUP");
        duplicate.setCluster("CLUSTER_DUP");

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict());
    }

    @Test
    void update_WhenExists_ShouldReturn200WithUpdatedEntity() throws Exception {
        IacVmClusterMapping updated = new IacVmClusterMapping();
        updated.setId(new IacVmClusterMappingId("FAB1", "PHASE1"));
        updated.setFz("FZ_UPDATED");
        updated.setCluster("CLUSTER_UPDATED");

        mockMvc.perform(put(BASE_URL + "/FAB1/PHASE1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id.fab", is("FAB1")))
                .andExpect(jsonPath("$.id.phase", is("PHASE1")))
                .andExpect(jsonPath("$.fz", is("FZ_UPDATED")))
                .andExpect(jsonPath("$.cluster", is("CLUSTER_UPDATED")));
    }

    @Test
    void update_WhenNotExists_ShouldReturn404() throws Exception {
        IacVmClusterMapping updated = new IacVmClusterMapping();
        updated.setId(new IacVmClusterMappingId("NOTEXIST", "NOTEXIST"));
        updated.setFz("FZ_UPDATED");
        updated.setCluster("CLUSTER_UPDATED");

        mockMvc.perform(put(BASE_URL + "/NOTEXIST/NOTEXIST")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_WhenExists_ShouldReturn204() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/FAB1/PHASE1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_WhenNotExists_ShouldReturn404() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/NOTEXIST/NOTEXIST")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_ShouldActuallyRemoveFromDatabase() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/FAB1/PHASE1"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get(BASE_URL + "/FAB1/PHASE1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_ThenGetAll_ShouldReflectNewRecord() throws Exception {
        IacVmClusterMapping newMapping = new IacVmClusterMapping();
        newMapping.setId(new IacVmClusterMappingId("FAB4", "PHASE4"));
        newMapping.setFz("FZ4");
        newMapping.setCluster("CLUSTER4");

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMapping)))
                .andExpect(status().isCreated());

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }
}