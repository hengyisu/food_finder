package com.example.iac.service;

import com.example.iac.entity.IacVmClusterMapping;
import com.example.iac.entity.IacVmClusterMappingId;
import com.example.iac.exception.ResourceNotFoundException;
import com.example.iac.repository.IacVmClusterMappingRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class IacVmClusterMappingServiceImpl implements IacVmClusterMappingService {

    private final IacVmClusterMappingRepository repository;

    public IacVmClusterMappingServiceImpl(IacVmClusterMappingRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<IacVmClusterMapping> findAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public IacVmClusterMapping findById(String fab, String phase) {
        IacVmClusterMappingId id = new IacVmClusterMappingId(fab, phase);
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "IacVmClusterMapping not found for fab=" + fab + ", phase=" + phase));
    }

    @Override
    public IacVmClusterMapping create(IacVmClusterMapping entity) {
        IacVmClusterMappingId id = entity.getId();
        if (id != null && repository.existsById(id)) {
            throw new DataIntegrityViolationException(
                    "IacVmClusterMapping already exists for fab=" + id.getFab() + ", phase=" + id.getPhase());
        }
        return repository.save(entity);
    }

    @Override
    public IacVmClusterMapping update(String fab, String phase, IacVmClusterMapping updated) {
        IacVmClusterMappingId id = new IacVmClusterMappingId(fab, phase);
        IacVmClusterMapping existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "IacVmClusterMapping not found for fab=" + fab + ", phase=" + phase));
        existing.setFz(updated.getFz());
        existing.setCluster(updated.getCluster());
        return repository.save(existing);
    }

    @Override
    public void delete(String fab, String phase) {
        IacVmClusterMappingId id = new IacVmClusterMappingId(fab, phase);
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "IacVmClusterMapping not found for fab=" + fab + ", phase=" + phase);
        }
        repository.deleteById(id);
    }
}