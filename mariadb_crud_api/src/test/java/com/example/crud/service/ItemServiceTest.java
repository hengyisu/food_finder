package com.example.crud.service;

import com.example.crud.entity.Item;
import com.example.crud.exception.ResourceNotFoundException;
import com.example.crud.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemService itemService;

    private Item item1;
    private Item item2;

    @BeforeEach
    void setUp() {
        item1 = new Item();
        item1.setId(1L);
        item1.setName("Test Item 1");
        item1.setDescription("Description 1");
        item1.setPrice(100.0);

        item2 = new Item();
        item2.setId(2L);
        item2.setName("Test Item 2");
        item2.setDescription("Description 2");
        item2.setPrice(200.0);
    }

    // ==================== getAllItems ====================

    @Test
    @DisplayName("getAllItems - 應回傳所有 Item 清單")
    void getAllItems_ShouldReturnAllItems() {
        when(itemRepository.findAll()).thenReturn(Arrays.asList(item1, item2));

        List<Item> result = itemService.getAllItems();

        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(item1, item2);
        verify(itemRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAllItems - 資料庫無資料時應回傳空清單")
    void getAllItems_WhenEmpty_ShouldReturnEmptyList() {
        when(itemRepository.findAll()).thenReturn(List.of());

        List<Item> result = itemService.getAllItems();

        assertThat(result).isEmpty();
        verify(itemRepository, times(1)).findAll();
    }

    // ==================== getItemById ====================

    @Test
    @DisplayName("getItemById - 找到 Item 時應回傳正確物件")
    void getItemById_WhenFound_ShouldReturnItem() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item1));

        Item result = itemService.getItemById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Test Item 1");
        verify(itemRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getItemById - 找不到時應拋出 ResourceNotFoundException")
    void getItemById_WhenNotFound_ShouldThrowResourceNotFoundException() {
        when(itemRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.getItemById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(itemRepository, times(1)).findById(99L);
    }

    // ==================== createItem ====================

    @Test
    @DisplayName("createItem - 應儲存並回傳新建 Item")
    void createItem_ShouldSaveAndReturnItem() {
        Item newItem = new Item();
        newItem.setName("New Item");
        newItem.setDescription("New Description");
        newItem.setPrice(50.0);

        Item savedItem = new Item();
        savedItem.setId(3L);
        savedItem.setName("New Item");
        savedItem.setDescription("New Description");
        savedItem.setPrice(50.0);

        when(itemRepository.save(any(Item.class))).thenReturn(savedItem);

        Item result = itemService.createItem(newItem);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(3L);
        assertThat(result.getName()).isEqualTo("New Item");
        assertThat(result.getPrice()).isEqualTo(50.0);
        verify(itemRepository, times(1)).save(newItem);
    }

    @Test
    @DisplayName("createItem - Repository 拋出例外時應向上傳遞")
    void createItem_WhenRepositoryThrows_ShouldPropagateException() {
        when(itemRepository.save(any(Item.class))).thenThrow(new RuntimeException("DB error"));

        assertThatThrownBy(() -> itemService.createItem(item1))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("DB error");
    }

    // ==================== updateItem ====================

    @Test
    @DisplayName("updateItem - 找到 Item 時應更新並回傳")
    void updateItem_WhenFound_ShouldUpdateAndReturn() {
        Item updateRequest = new Item();
        updateRequest.setName("Updated Name");
        updateRequest.setDescription("Updated Description");
        updateRequest.setPrice(999.0);

        Item updatedItem = new Item();
        updatedItem.setId(1L);
        updatedItem.setName("Updated Name");
        updatedItem.setDescription("Updated Description");
        updatedItem.setPrice(999.0);

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item1));
        when(itemRepository.save(any(Item.class))).thenReturn(updatedItem);

        Item result = itemService.updateItem(1L, updateRequest);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Updated Name");
        assertThat(result.getDescription()).isEqualTo("Updated Description");
        assertThat(result.getPrice()).isEqualTo(999.0);
        verify(itemRepository, times(1)).findById(1L);
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    @DisplayName("updateItem - 找不到時應拋出 ResourceNotFoundException")
    void updateItem_WhenNotFound_ShouldThrowResourceNotFoundException() {
        Item updateRequest = new Item();
        updateRequest.setName("Updated");

        when(itemRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.updateItem(99L, updateRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(itemRepository, times(1)).findById(99L);
        verify(itemRepository, never()).save(any(Item.class));
    }

    // ==================== deleteItem ====================

    @Test
    @DisplayName("deleteItem - 找到 Item 時應呼叫 delete 並不拋例外")
    void deleteItem_WhenFound_ShouldDeleteSuccessfully() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item1));
        doNothing().when(itemRepository).delete(item1);

        assertThatCode(() -> itemService.deleteItem(1L)).doesNotThrowAnyException();

        verify(itemRepository, times(1)).findById(1L);
        verify(itemRepository, times(1)).delete(item1);
    }

    @Test
    @DisplayName("deleteItem - 找不到時應拋出 ResourceNotFoundException 且不呼叫 delete")
    void deleteItem_WhenNotFound_ShouldThrowResourceNotFoundException() {
        when(itemRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.deleteItem(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(itemRepository, times(1)).findById(99L);
        verify(itemRepository, never()).delete(any(Item.class));
    }

    @Test
    @DisplayName("deleteItem - Repository delete 拋出例外時應向上傳遞")
    void deleteItem_WhenDeleteThrows_ShouldPropagateException() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item1));
        doThrow(new RuntimeException("Delete failed")).when(itemRepository).delete(item1);

        assertThatThrownBy(() -> itemService.deleteItem(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Delete failed");
    }

    // ==================== 邊界條件 ====================

    @Test
    @DisplayName("getItemById - ID 為 0 時應拋出 ResourceNotFoundException")
    void getItemById_WithZeroId_ShouldThrowResourceNotFoundException() {
        when(itemRepository.findById(0L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.getItemById(0L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("createItem - price 為 0 時應正常儲存")
    void createItem_WithZeroPrice_ShouldSaveSuccessfully() {
        Item zeroPrice = new Item();
        zeroPrice.setName("Free Item");
        zeroPrice.setPrice(0.0);

        Item saved = new Item();
        saved.setId(5L);
        saved.setName("Free Item");
        saved.setPrice(0.0);

        when(itemRepository.save(any(Item.class))).thenReturn(saved);

        Item result = itemService.createItem(zeroPrice);

        assertThat(result.getPrice()).isEqualTo(0.0);
        verify(itemRepository, times(1)).save(zeroPrice);
    }

    @Test
    @DisplayName("updateItem - 僅更新部分欄位時其餘欄位應保持原值")
    void updateItem_PartialUpdate_ShouldPreserveOtherFields() {
        Item partialUpdate = new Item();
        partialUpdate.setName("Partial Name");

        Item savedResult = new Item();
        savedResult.setId(1L);
        savedResult.setName("Partial Name");
        savedResult.setDescription("Description 1");
        savedResult.setPrice(100.0);

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item1));
        when(itemRepository.save(any(Item.class))).thenReturn(savedResult);

        Item result = itemService.updateItem(1L, partialUpdate);

        assertThat(result.getName()).isEqualTo("Partial Name");
        assertThat(result.getDescription()).isEqualTo("Description 1");
        assertThat(result.getPrice()).isEqualTo(100.0);
    }
}