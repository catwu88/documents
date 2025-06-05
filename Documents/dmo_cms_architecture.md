# DMO CMS系統架構設計

## 1. 系統架構概覽

### 1.1 整體架構模式
**採用分層架構 + 微服務化設計**
- **前端層**: 管理後台 + 前台展示
- **API Gateway層**: 統一入口與路由
- **業務服務層**: 模組化業務服務
- **數據層**: 主數據庫 + 快取 + 文件存儲
- **基礎設施層**: 監控、日誌、部署

### 1.2 架構圖

```
┌─────────────────────────────────────────────────────────────────┐
│                          用戶層 (User Layer)                    │
├─────────────────────────────────────────────────────────────────┤
│  管理後台(Admin Panel)    │    前台展示(Frontend)    │  移動端APP   │
│  - 儀表板管理              │    - 商家展示頁面         │  (未來擴展)  │
│  - 商家管理               │    - 活動展示頁面         │             │
│  - 活動管理               │    - 搜索與篩選          │             │
│  - 數據分析               │                         │             │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CDN + 負載均衡器                             │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Gateway                              │
│  - 路由管理    - 認證授權    - 限流控制    - 監控日誌             │
└─────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      應用服務層 (Application Layer)              │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   用戶服務       │    商家服務      │         活動服務             │
│   User Service  │ Business Service│      Event Service          │
│                 │                 │                             │
│ - 用戶管理       │ - 商家CRUD       │ - 活動管理                   │
│ - 權限控制       │ - Excel處理      │ - 地圖整合                   │
│ - 操作日誌       │ - 狀態管理       │ - 商家關聯                   │
├─────────────────┼─────────────────┼─────────────────────────────┤
│   數據分析服務   │   標籤服務       │      檔案管理服務            │
│ Analytics Service│  Tag Service    │    File Service             │
│                 │                 │                             │
│ - 統計分析       │ - 自動標籤       │ - 檔案上傳                   │
│ - 報表生成       │ - 自訂標籤       │ - 圖片處理                   │
│ - 數據可視化     │ - 分類管理       │ - CDN整合                   │
└─────────────────┴─────────────────┴─────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     整合服務層 (Integration Layer)               │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Google API服務  │   通知服務       │        快取服務              │
│ Google Service  │Notification Srv │     Cache Service           │
│                 │                 │                             │
│ - Maps API      │ - 郵件通知       │ - Redis快取                  │
│ - Places API    │ - 系統通知       │ - 會話管理                   │
│ - Reviews API   │ - 狀態變更通知   │ - 查詢優化                   │
│ - Street View   │                 │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      數據層 (Data Layer)                        │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   主資料庫       │    檔案存儲      │         搜索引擎             │
│ Primary Database│  File Storage   │     Search Engine           │
│                 │                 │                             │
│ - PostgreSQL    │ - AWS S3/       │ - Elasticsearch             │
│ - 商家資料       │   Azure Blob    │ - 商家搜索                   │
│ - 用戶資料       │ - 圖片存儲       │ - 全文檢索                   │
│ - 活動資料       │ - 檔案管理       │ - 分析數據                   │
│ - 操作日誌       │                 │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   基礎設施層 (Infrastructure Layer)              │
├─────────────────┬─────────────────┬─────────────────────────────┤
│    監控服務      │    日誌服務      │        部署服務              │
│ Monitoring      │  Logging        │     Deployment              │
│                 │                 │                             │
│ - 系統監控       │ - 操作日誌       │ - Docker容器                 │
│ - 性能監控       │ - 錯誤日誌       │ - Kubernetes                │
│ - 警報系統       │ - 訪問日誌       │ - CI/CD流水線                │
│ - 健康檢查       │ - 日誌分析       │ - 自動部署                   │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

## 2. 核心服務詳細設計

### 2.1 用戶服務 (User Service)

**職責範圍**:
- 用戶註冊、登入、登出
- 權限管理（角色基礎存取控制 RBAC）
- 操作日誌記錄
- 會話管理

**API設計**:
```
POST /api/auth/login          # 用戶登入
POST /api/auth/logout         # 用戶登出
GET  /api/users               # 獲取用戶列表
POST /api/users               # 創建用戶
PUT  /api/users/{id}          # 更新用戶
GET  /api/audit-logs          # 獲取操作日誌
```

**數據模型**:
- Users: 用戶基本資訊
- Roles: 角色定義
- Permissions: 權限定義
- UserRoles: 用戶角色關聯
- AuditLogs: 操作日誌

### 2.2 商家服務 (Business Service)

**職責範圍**:
- 商家資料CRUD操作
- Excel批次上傳處理
- 商家狀態管理
- 資料驗證與清洗

**API設計**:
```
GET    /api/businesses           # 獲取商家列表
POST   /api/businesses           # 創建商家
PUT    /api/businesses/{id}      # 更新商家
DELETE /api/businesses/{id}      # 刪除商家
POST   /api/businesses/upload    # Excel批次上傳
PUT    /api/businesses/{id}/status # 更新商家狀態
GET    /api/businesses/{id}/analytics # 商家分析數據
```

**數據模型**:
- Businesses: 商家基本資訊
- BusinessStatus: 商家狀態記錄
- BusinessPhotos: 商家照片
- BusinessReviews: 商家評論（從Google同步）

### 2.3 活動服務 (Event Service)

**職責範圍**:
- 活動資料管理
- 地理位置處理
- 商家與活動關聯
- 活動狀態管理

**API設計**:
```
GET    /api/events               # 獲取活動列表
POST   /api/events               # 創建活動
PUT    /api/events/{id}          # 更新活動
DELETE /api/events/{id}          # 刪除活動
POST   /api/events/{id}/businesses # 添加活動商家
GET    /api/events/{id}/map      # 獲取活動地圖數據
```

**數據模型**:
- Events: 活動基本資訊
- EventBusinesses: 活動商家關聯
- EventGeofences: 活動地理範圍

### 2.4 標籤服務 (Tag Service)

**職責範圍**:
- 自動標籤生成
- 自訂標籤管理
- 標籤分類系統
- 標籤統計分析

**API設計**:
```
GET    /api/tags                 # 獲取標籤列表
POST   /api/tags                 # 創建標籤
PUT    /api/tags/{id}            # 更新標籤
DELETE /api/tags/{id}            # 刪除標籤
POST   /api/businesses/{id}/tags # 為商家設定標籤
POST   /api/tags/auto-generate   # 自動生成標籤
```

### 2.5 數據分析服務 (Analytics Service)

**職責範圍**:
- 商家表現分析
- 儀表板數據生成
- 報表生成
- 趨勢分析

**API設計**:
```
GET /api/analytics/dashboard     # 儀表板數據
GET /api/analytics/businesses/{id} # 商家分析
GET /api/analytics/events/{id}   # 活動分析
GET /api/analytics/reports       # 生成報表
```

### 2.6 Google API服務 (Google Service)

**職責範圍**:
- Google Maps整合
- Google Places資料獲取
- Google Reviews同步
- 地理編碼服務

**功能實現**:
```
POST /api/google/places/search   # 搜索商家
GET  /api/google/places/{id}     # 獲取商家詳情
GET  /api/google/reviews/{id}    # 獲取商家評論
POST /api/google/geocode         # 地址轉座標
```

## 3. 數據庫設計

### 3.1 核心數據表

**用戶相關**:
```sql
-- 用戶表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 角色表
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB
);
```

**商家相關**:
```sql
-- 商家表
CREATE TABLE businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    description TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    google_place_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商家照片表
CREATE TABLE business_photos (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id),
    photo_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0
);

-- 商家標籤關聯表
CREATE TABLE business_tags (
    business_id INTEGER REFERENCES businesses(id),
    tag_id INTEGER REFERENCES tags(id),
    PRIMARY KEY (business_id, tag_id)
);
```

**活動相關**:
```sql
-- 活動表
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    geofence GEOMETRY(POLYGON, 4326),
    status VARCHAR(20) DEFAULT 'draft',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 活動商家關聯表
CREATE TABLE event_businesses (
    event_id INTEGER REFERENCES events(id),
    business_id INTEGER REFERENCES businesses(id),
    PRIMARY KEY (event_id, business_id)
);
```

### 3.2 分析數據表

```sql
-- 商家分析數據表
CREATE TABLE business_analytics (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id),
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    click_through_rate DECIMAL(5,4) DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0
);

-- 操作日誌表
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. 技術選型

### 4.1 前端技術棧
- **框架**: React.js / Vue.js
- **UI庫**: Ant Design / Element Plus
- **地圖**: Google Maps JavaScript API
- **圖表**: Chart.js / D3.js
- **狀態管理**: Redux / Vuex
- **打包工具**: Webpack / Vite

### 4.2 後端技術棧
- **語言**: Node.js (Express) / Python (FastAPI) / Java (Spring Boot)
- **API Gateway**: Kong / Nginx
- **認證**: JWT + OAuth 2.0
- **檔案處理**: Multer / Sharp (圖片處理)
- **排程任務**: Bull Queue / Celery

### 4.3 數據庫與存儲
- **主數據庫**: PostgreSQL (支援地理數據)
- **快取**: Redis
- **搜索引擎**: Elasticsearch
- **檔案存儲**: AWS S3 / Azure Blob Storage
- **CDN**: CloudFlare / AWS CloudFront

### 4.4 基礎設施
- **容器化**: Docker + Docker Compose
- **編排**: Kubernetes (生產環境)
- **監控**: Prometheus + Grafana
- **日誌**: ELK Stack (Elasticsearch + Logstash + Kibana)
- **CI/CD**: GitHub Actions / GitLab CI

## 5. 安全性設計

### 5.1 認證與授權
- **多因子認證**: 支援簡訊/郵件驗證碼
- **角色基礎存取控制**: 精細化權限管理
- **API限流**: 防止API濫用
- **HTTPS**: 全站SSL加密

### 5.2 數據安全
- **敏感資料加密**: 密碼、個人資訊加密存儲
- **SQL注入防護**: 參數化查詢
- **XSS防護**: 輸入過濾與輸出編碼
- **CSRF防護**: Token驗證

## 6. 性能優化

### 6.1 快取策略
- **Redis快取**: 熱點數據快取
- **CDN**: 靜態資源分發
- **數據庫查詢優化**: 索引設計與查詢優化
- **分頁載入**: 大數據量分頁處理

### 6.2 擴展性設計
- **微服務架構**: 服務獨立部署與擴展
- **負載均衡**: 水平擴展支援
- **數據庫分片**: 大數據量分散處理
- **非同步處理**: 耗時操作異步化

## 7. 監控與維運

### 7.1 系統監控
- **應用監控**: APM工具監控應用性能
- **基礎設施監控**: 服務器資源監控
- **業務監控**: 關鍵業務指標監控
- **告警系統**: 多通道告警通知

### 7.2 日誌管理
- **結構化日誌**: JSON格式統一日誌
- **日誌收集**: 集中化日誌收集
- **日誌分析**: 實時日誌分析與警報
- **日誌保留**: 合規性日誌保留策略

## 8. 部署架構

### 8.1 環境劃分
- **開發環境**: 開發者本地環境
- **測試環境**: 功能測試與整合測試
- **預生產環境**: 生產環境的鏡像環境
- **生產環境**: 正式運行環境

### 8.2 部署策略
- **藍綠部署**: 零停機部署
- **滾動更新**: 漸進式更新
- **自動回滾**: 發現問題自動回滾
- **健康檢查**: 部署後健康狀態檢查

---

**文檔版本**: v1.0  
**建立日期**: 2025年5月  
**架構師**: [待填入]  
**審核人**: [待填入]