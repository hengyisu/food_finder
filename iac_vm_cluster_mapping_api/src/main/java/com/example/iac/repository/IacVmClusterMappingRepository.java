package com.example.iac.repository;

import com.example.iac.entity.IacVmClusterMapping;
import com.example.iac.entity.IacVmClusterMappingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IacVmClusterMappingRepository extends JpaRepository<IacVmClusterMapping, IacVmClusterMappingId> {
}