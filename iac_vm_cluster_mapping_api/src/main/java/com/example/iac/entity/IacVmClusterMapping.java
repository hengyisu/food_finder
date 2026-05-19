根據 spec，複合主鍵只含 `fab + phase`，`fz` 與 `cluster` 是一般欄位。Bug 的根本原因是有人把它們錯誤地放進 `IacVmClusterMappingId`，導致 Entity 本體與 EmbeddedId 雙重宣告。正確修正是確保 `fz`/`cluster` 僅存在於 Entity 本體，EmbeddedId 只保留 `fab` + `phase`。

package com.example.iac.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "iac_vm_cluster_mapping")
public class IacVmClusterMapping {

    @EmbeddedId
    private IacVmClusterMappingId id;

    @Column(name = "fz")
    private String fz;

    @Column(name = "cluster")
    private String cluster;

    public IacVmClusterMapping() {}

    public IacVmClusterMapping(IacVmClusterMappingId id, String fz, String cluster) {
        this.id = id;
        this.fz = fz;
        this.cluster = cluster;
    }

    public IacVmClusterMappingId getId() {
        return id;
    }

    public void setId(IacVmClusterMappingId id) {
        this.id = id;
    }

    public String getFz() {
        return fz;
    }

    public void setFz(String fz) {
        this.fz = fz;
    }

    public String getCluster() {
        return cluster;
    }

    public void setCluster(String cluster) {
        this.cluster = cluster;
    }
}

---

修正重點：`IacVmClusterMappingId` 只保留 `fab` + `phase` 兩個主鍵欄位，`fz` 與 `cluster` 僅在 Entity 本體以 `@Column` 宣告一次，消除雙重映射。