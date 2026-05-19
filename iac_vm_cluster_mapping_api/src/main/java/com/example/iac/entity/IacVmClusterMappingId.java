package com.example.iac.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class IacVmClusterMappingId implements Serializable {

    private String fab;
    private String phase;

    public IacVmClusterMappingId() {}

    public IacVmClusterMappingId(String fab, String phase) {
        this.fab = fab;
        this.phase = phase;
    }

    public String getFab() {
        return fab;
    }

    public void setFab(String fab) {
        this.fab = fab;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof IacVmClusterMappingId)) return false;
        IacVmClusterMappingId that = (IacVmClusterMappingId) o;
        return Objects.equals(fab, that.fab) && Objects.equals(phase, that.phase);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fab, phase);
    }
}