# MariaDB CRUD API Design — `iac_vm_cluster_mapping`

## Overview
以 Spring Boot 建立一組 RESTful API，對 MariaDB 中的 `iac_vm_cluster_mapping` 資料表進行完整的 CRUD 操作，主鍵為 `fab + phase` 複合主鍵。

## Architecture
- **框架**：Spring Boot 3.x
- **資料存取**：Spring Data JPA（Hibernate）+ MariaDB JDBC Driver
- **API 風格**：RESTful，JSON 格式
- **模式**：Controller → Service → Repository 三層架構

## Components

- **Entity (`IacVmClusterMapping`)**
  - 欄位：`fab`（String）、`phase`（String）、`fz`（String）、`cluster`（String）
  - 複合主鍵：使用 `@EmbeddedId` 搭配 `IacVmClusterMappingId`（fab + phase）

- **Composite Key Class (`IacVmClusterMappingId`)**
  - 實作 `Serializable`，包含 `fab`、`phase` 兩個欄位

- **Repository (`IacVmClusterMappingRepository`)**
  - 繼承 `JpaRepository<IacVmClusterMapping, IacVmClusterMappingId>`

- **Service (`IacVmClusterMappingService`)**
  - 封裝 CRUD 業務邏輯，處理 Not Found 例外

- **Controller (`IacVmClusterMappingController`)**
  - 提供以下端點：

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/api/iac-vm-cluster-mappings` | 取得全部 |
| GET | `/api/iac-vm-cluster-mappings/{fab}/{phase}` | 依複合主鍵取得單筆 |
| POST | `/api/iac-vm-cluster-mappings` | 新增 |
| PUT | `/api/iac-vm-cluster-mappings/{fab}/{phase}` | 更新 |
| DELETE | `/api/iac-vm-cluster-mappings/{fab}/{phase}` | 刪除 |

## Data Flow

1. Client 送出 HTTP Request
2. Controller 解析路徑參數與 Request Body，組成 DTO 或 Entity
3. Service 呼叫 Repository 執行資料庫操作
4. Repository 透過 JPA 對 MariaDB 進行 SQL 操作
5. 結果逐層回傳，Controller 回應 HTTP Response（JSON）

## Error Handling

- 查詢或更新不存在的主鍵 → 回傳 `404 Not Found`（自定義 `ResourceNotFoundException`）
- 新增重複主鍵 → 捕捉 `DataIntegrityViolationException` → 回傳 `409 Conflict`
- 其他未預期錯誤 → 全域 `@RestControllerAdvice` 統一回傳 `500 Internal Server Error`

## Testing

- **單元測試**：用 JUnit 5 + Mockito 測試 Service 層邏輯
- **整合測試**：用 `@SpringBootTest` + H2（或 Testcontainers MariaDB）測試完整請求流程
- **手動測試**：整合 Springdoc OpenAPI（Swagger UI），可直接在瀏覽器測試各端點