package com.example.crud.controller;

import com.example.crud.entity.Item;
import com.example.crud.repository.ItemRepository;
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
class ItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Item savedItem;

    @BeforeEach
    void setUp() {
        itemRepository.deleteAll();

        Item item = new Item();
        item.setName("Test Item");
        item.setDescription("Test Description");
        item.setPrice(99.99);
        savedItem = itemRepository.save(item);
    }

    // GET /api/items - 取得所有項目

    @Test
    void getAllItems_shouldReturn200WithList() throws Exception {
        mockMvc.perform(get("/api/items")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].id", notNullValue()))
                .andExpect(jsonPath("$[0].name", notNullValue()));
    }

    @Test
    void getAllItems_whenEmpty_shouldReturn200WithEmptyList() throws Exception {
        itemRepository.deleteAll();

        mockMvc.perform(get("/api/items")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    // GET /api/items/{id} - 取得單一項目

    @Test
    void getItemById_whenExists_shouldReturn200WithItem() throws Exception {
        mockMvc.perform(get("/api/items/{id}", savedItem.getId())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(savedItem.getId().intValue())))
                .andExpect(jsonPath("$.name", is("Test Item")))
                .andExpect(jsonPath("$.description", is("Test Description")))
                .andExpect(jsonPath("$.price", is(99.99)));
    }

    @Test
    void getItemById_whenNotExists_shouldReturn404WithErrorMessage() throws Exception {
        mockMvc.perform(get("/api/items/{id}", 999999L)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", notNullValue()));
    }

    // POST /api/items - 建立新項目

    @Test
    void createItem_withValidData_shouldReturn201WithCreatedItem() throws Exception {
        Item newItem = new Item();
        newItem.setName("New Item");
        newItem.setDescription("New Description");
        newItem.setPrice(199.99);

        mockMvc.perform(post("/api/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newItem))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("New Item")))
                .andExpect(jsonPath("$.description", is("New Description")))
                .andExpect(jsonPath("$.price", is(199.99)));
    }

    @Test
    void createItem_withMissingName_shouldReturn400() throws Exception {
        Item invalidItem = new Item();
        invalidItem.setDescription("No name item");
        invalidItem.setPrice(50.0);

        mockMvc.perform(post("/api/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidItem))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createItem_withEmptyBody_shouldReturn400() throws Exception {
        mockMvc.perform(post("/api/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createItem_withInvalidJson_shouldReturn400() throws Exception {
        mockMvc.perform(post("/api/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content("not-valid-json")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // PUT /api/items/{id} - 更新項目

    @Test
    void updateItem_whenExists_shouldReturn200WithUpdatedItem() throws Exception {
        Item updatedItem = new Item();
        updatedItem.setName("Updated Item");
        updatedItem.setDescription("Updated Description");
        updatedItem.setPrice(299.99);

        mockMvc.perform(put("/api/items/{id}", savedItem.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedItem))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(savedItem.getId().intValue())))
                .andExpect(jsonPath("$.name", is("Updated Item")))
                .andExpect(jsonPath("$.description", is("Updated Description")))
                .andExpect(jsonPath("$.price", is(299.99)));
    }

    @Test
    void updateItem_whenNotExists_shouldReturn404WithErrorMessage() throws Exception {
        Item updatedItem = new Item();
        updatedItem.setName("Updated Item");
        updatedItem.setDescription("Updated Description");
        updatedItem.setPrice(299.99);

        mockMvc.perform(put("/api/items/{id}", 999999L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedItem))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", notNullValue()));
    }

    @Test
    void updateItem_withMissingName_shouldReturn400() throws Exception {
        Item invalidItem = new Item();
        invalidItem.setDescription("Missing name");
        invalidItem.setPrice(100.0);

        mockMvc.perform(put("/api/items/{id}", savedItem.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidItem))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // DELETE /api/items/{id} - 刪除項目

    @Test
    void deleteItem_whenExists_shouldReturn204NoContent() throws Exception {
        mockMvc.perform(delete("/api/items/{id}", savedItem.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteItem_whenNotExists_shouldReturn404WithErrorMessage() throws Exception {
        mockMvc.perform(delete("/api/items/{id}", 999999L)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", notNullValue()));
    }

    @Test
    void deleteItem_shouldActuallyRemoveFromDatabase() throws Exception {
        mockMvc.perform(delete("/api/items/{id}", savedItem.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/items/{id}", savedItem.getId())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    // 資料持久性驗證

    @Test
    void createItem_shouldPersistToDatabase() throws Exception {
        Item newItem = new Item();
        newItem.setName("Persisted Item");
        newItem.setDescription("Should be saved");
        newItem.setPrice(49.99);

        String responseBody = mockMvc.perform(post("/api/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newItem))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Item createdItem = objectMapper.readValue(responseBody, Item.class);

        mockMvc.perform(get("/api/items/{id}", createdItem.getId())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Persisted Item")));
    }

    @Test
    void updateItem_shouldReflectChangesOnSubsequentGet() throws Exception {
        Item updatedItem = new Item();
        updatedItem.setName("Reflected Update");
        updatedItem.setDescription("Should reflect");
        updatedItem.setPrice(77.77);

        mockMvc.perform(put("/api/items/{id}", savedItem.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedItem))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/items/{id}", savedItem.getId())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Reflected Update")))
                .andExpect(jsonPath("$.price", is(77.77)));
    }
}