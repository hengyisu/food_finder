package com.example.iac.service;

import com.example.iac.entity.IacVmClusterMapping;
import com.example.iac.entity.IacVmClusterMappingId;

import java.util.List;

public interface IacVmClusterMappingService {

    List<IacVmClusterMapping> findAll();

    IacVmClusterMapping findById(IacVmClusterMappingId id);

    IacVmClusterMapping create(IacVmClusterMapping entity);

    IacVmClusterMapping update(IacVmClusterMappingId id, IacVmClusterMapping entity);

    void delete(IacVmClusterMappingId id);
}