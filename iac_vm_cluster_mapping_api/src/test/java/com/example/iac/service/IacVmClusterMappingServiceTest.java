package com.example.iac.service;

import com.example.iac.entity.IacVmClusterMapping;
import com.example.iac.entity.IacVmClusterMappingId;
import com.example.iac.exception.ResourceNotFoundException;
import com.example.iac.repository.IacVmClusterMappingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IacVmClusterMappingServiceTest {

    @Mock
    private IacVmClusterMappingRepository repository;

    @InjectMocks
    private IacVmClusterMappingService service;

    private IacVmClusterMappingId id;
    private IacVmClusterMapping entity;

    @BeforeEach
    void setUp() {
        id = new IacVmClusterMappingId("FAB01", "P1");
        entity = new IacVmClusterMapping();
        entity.setId(id);
        entity.setFz("FZ-A");
        entity.setCluster("cluster-01");
    }

    @Test
    void findAll_shouldReturnAllMappings() {
        IacVmClusterMapping second = new IacVmClusterMapping();
        second.setId(new IacVmClusterMappingId("FAB02", "P2"));
        second.setFz("FZ-B");
        second.setCluster("cluster-02");

        when(repository.findAll()).thenReturn(List.of(entity, second));

        List<IacVmClusterMapping> result = service.findAll();

        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(entity, second);
        verify(repository, times(1)).findAll();
    }

    @Test
    void findAll_whenEmpty_shouldReturnEmptyList() {
        when(repository.findAll()).thenReturn(List.of());

        List<IacVmClusterMapping> result = service.findAll();

        assertThat(result).isEmpty();
        verify(repository, times(1)).findAll();
    }

    @Test
    void findById_whenExists_shouldReturnMapping() {
        when(repository.findById(id)).thenReturn(Optional.of(entity));

        IacVmClusterMapping result = service.findById("FAB01", "P1");

        assertThat(result).isNotNull();
        assertThat(result.getId().getFab()).isEqualTo("FAB01");
        assertThat(result.getId().getPhase()).isEqualTo("P1");
        assertThat(result.getFz()).isEqualTo("FZ-A");
        assertThat(result.getCluster()).isEqualTo("cluster-01");
        verify(repository, times(1)).findById(id);
    }

    @Test
    void findById_whenNotExists_shouldThrowResourceNotFoundException() {
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById("FAB01", "P1"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("FAB01")
                .hasMessageContaining("P1");

        verify(repository, times(1)).findById(id);
    }

    @Test
    void create_shouldSaveAndReturnMapping() {
        when(repository.save(entity)).thenReturn(entity);

        IacVmClusterMapping result = service.create(entity);

        assertThat(result).isEqualTo(entity);
        verify(repository, times(1)).save(entity);
    }

    @Test
    void update_whenExists_shouldUpdateFieldsAndReturn() {
        IacVmClusterMapping incoming = new IacVmClusterMapping();
        incoming.setId(id);
        incoming.setFz("FZ-UPDATED");
        incoming.setCluster("cluster-updated");

        IacVmClusterMapping saved = new IacVmClusterMapping();
        saved.setId(id);
        saved.setFz("FZ-UPDATED");
        saved.setCluster("cluster-updated");

        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(repository.save(any(IacVmClusterMapping.class))).thenReturn(saved);

        IacVmClusterMapping result = service.update("FAB01", "P1", incoming);

        assertThat(result.getFz()).isEqualTo("FZ-UPDATED");
        assertThat(result.getCluster()).isEqualTo("cluster-updated");
        verify(repository, times(1)).findById(id);
        verify(repository, times(1)).save(any(IacVmClusterMapping.class));
    }

    @Test
    void update_whenNotExists_shouldThrowResourceNotFoundException() {
        IacVmClusterMapping incoming = new IacVmClusterMapping();
        incoming.setFz("FZ-UPDATED");
        incoming.setCluster("cluster-updated");

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update("FAB01", "P1", incoming))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("FAB01")
                .hasMessageContaining("P1");

        verify(repository, times(1)).findById(id);
        verify(repository, never()).save(any());
    }

    @Test
    void delete_whenExists_shouldDeleteSuccessfully() {
        when(repository.findById(id)).thenReturn(Optional.of(entity));
        doNothing().when(repository).delete(entity);

        assertThatNoException().isThrownBy(() -> service.delete("FAB01", "P1"));

        verify(repository, times(1)).findById(id);
        verify(repository, times(1)).delete(entity);
    }

    @Test
    void delete_whenNotExists_shouldThrowResourceNotFoundException() {
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete("FAB01", "P1"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("FAB01")
                .hasMessageContaining("P1");

        verify(repository, times(1)).findById(id);
        verify(repository, never()).delete(any());
    }
}