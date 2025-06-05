# DMO CMS Demo - 目的地管理系統演示

111111這是一個基於 React + TypeScript + Ant Design 的目的地管理系統（Destination Management Organization CMS）演示項目。

## 🌐 線上演示

**Live Demo**: https://catwu88.github.io/documents/

### 登入資訊
- **帳號**: `admin`
- **密碼**: `admin123`

## 🚀 快速開始

### 前置需求
- Node.js 16+ 
- npm 或 yarn

### 本地開發

```bash
# 克隆項目
git clone https://github.com/catwu88/documents.git
cd documents

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

開發服務器將在 http://localhost:5173 啟動

### 可用命令

```bash
# 開發
npm run dev          # 啟動開發服務器

# 構建
npm run build        # 構建生產版本
npm run preview      # 預覽生產構建

# 代碼質量
npm run lint         # 運行 ESLint 檢查

# 部署
npm run deploy       # 自動構建並部署到 GitHub Pages
```

## 📁 項目結構

經過重構，項目現在採用扁平化結構：

```
documents/ (項目根目錄)
├── README.md                       # 項目文檔
├── CLAUDE.md                       # 開發指南
├── admin-panel-README.md           # 原始 admin-panel 文檔
├── package.json                    # 項目配置
├── vite.config.ts                  # Vite 構建配置
├── tsconfig.json                   # TypeScript 配置
├── docs/                           # 架構文檔
│   ├── dmo_backend_architecture.md
│   ├── dmo_cms_architecture.md
│   ├── dmo_cms_prd.md
│   ├── dmo_frontend_architecture.md
│   └── dmo_user_journey.md
├── src/                            # React 應用源碼
│   ├── components/                 # 共用組件
│   │   ├── Layout/Layout.tsx       # 主要佈局組件
│   │   └── Map/OpenStreetMap.tsx   # 地圖組件
│   ├── contexts/                   # React Context
│   │   └── LanguageContext.tsx     # 多語言支持
│   ├── pages/                      # 頁面組件
│   │   ├── Dashboard/              # 儀表板
│   │   ├── Business/               # 商家管理
│   │   ├── Event/                  # 活動管理
│   │   ├── Analytics/              # 數據分析
│   │   ├── BatchUpload/            # 批量上傳
│   │   ├── Categories/             # 分類管理
│   │   ├── Labels/                 # 標籤管理
│   │   └── Login/                  # 登入頁面
│   ├── data/mockData.ts            # 模擬數據
│   ├── types/index.ts              # TypeScript 類型
│   ├── App.tsx                     # 根組件
│   └── main.tsx                    # 應用入口
└── public/                         # 靜態資源
    └── vite.svg
```

## 📋 功能特色

### 🏢 商家管理
- **商家列表**: 支援篩選、搜尋、批量操作
- **商家詳情**: 完整的商家資訊編輯表單
- **Excel 上傳**: 批量匯入商家資料
- **狀態管理**: 待審核、已核准、已發布、已拒絕
- **照片管理**: 多張照片上傳與管理
- **標籤系統**: 預設標籤與自定義標籤

### 🎉 活動管理
- **活動列表**: 表格視圖與日曆視圖
- **活動詳情**: 豐富的活動資訊編輯
- **時間管理**: 日期範圍與時間設定
- **報名設定**: 人數限制、費用設定
- **狀態追蹤**: 草稿、已發布、已取消、已結束

### 📊 數據分析
- **流量統計**: 瀏覽量、點擊量趨勢圖
- **分類分析**: 商家/活動分類分布
- **排行榜**: 熱門商家與活動
- **設備統計**: 訪問設備分析
- **數據匯出**: 支援報表匯出

### 🎛️ 儀表板
- **核心指標**: 商家數量、活動數量、用戶數量
- **趨勢圖表**: 流量變化趨勢
- **狀態分布**: 商家狀態統計
- **最新動態**: 系統活動記錄
- **待辦事項**: 待處理任務提醒

## 🛠️ 技術架構

### 前端技術棧
- **React 18**: 現代化 React 框架
- **TypeScript**: 類型安全的 JavaScript  
- **Vite**: 快速的構建工具與開發服務器
- **Ant Design 5.x**: 企業級 UI 組件庫
- **React Router v7**: 單頁應用路由管理
- **Leaflet**: 開源地圖組件 (OpenStreetMap)
- **Recharts**: 數據可視化圖表庫
- **Lucide React**: 現代化圖標庫

### 多語言支持
- **繁體中文** (默認)
- **English** 
- **日本語**
- 使用 React Context 進行語言狀態管理
- Ant Design 本地化集成

### 部署配置
- **GitHub Pages**: 自動化部署
- **gh-pages**: 部署工具
- **Base Path**: `/documents/` (適配 GitHub Pages)
- **Live URL**: https://catwu88.github.io/documents/

## 🎨 設計特色

### 用戶體驗
- **響應式設計**: 支援桌面與移動設備
- **中文本地化**: 完整的繁體中文界面
- **直觀導航**: 清晰的側邊欄導航
- **快速操作**: 批量操作與快捷功能
- **即時反饋**: 操作成功/失敗提示

### 視覺設計
- **現代化界面**: 簡潔美觀的設計風格
- **一致性**: 統一的設計語言
- **可讀性**: 清晰的信息層次
- **互動性**: 豐富的交互效果

## 📱 功能演示

### 商家管理流程
1. 進入商家列表頁面
2. 使用篩選器搜尋特定商家
3. 點擊「新增商家」創建新商家
4. 填寫商家基本資訊、上傳照片、設定標籤
5. 設定商家狀態並儲存

### 活動管理流程
1. 進入活動列表頁面
2. 切換表格視圖或日曆視圖
3. 點擊「新增活動」創建新活動
4. 設定活動時間、地點、報名資訊
5. 上傳活動照片並發布

### 數據分析查看
1. 進入分析頁面
2. 選擇時間範圍
3. 查看各項統計圖表
4. 匯出分析報告

## 🔧 開發說明

### 項目特點
- **扁平化結構**: 項目重構為根目錄直接包含源碼
- **模擬數據**: 所有數據都是模擬生成，用於演示目的
- **本地認證**: 登入驗證使用 localStorage 模擬
- **異步模擬**: API 調用使用 Promise + setTimeout 模擬網絡延遲

### 自定義配置
- **模擬數據**: 修改 `src/data/mockData.ts`
- **類型定義**: 調整 `src/types/index.ts`
- **主題配置**: Ant Design 默認主題
- **語言設置**: 在 `src/contexts/LanguageContext.tsx` 管理

### 代碼質量
- **TypeScript**: 全項目類型安全
- **ESLint**: 代碼規範檢查
- **現代化**: 使用 ES6+ 語法和 React Hooks

## 📝 重要說明

### 演示限制
- 這是一個純前端演示項目，**不包含真實後端 API**
- 數據**不會持久化保存**，刷新頁面後重置
- 部分功能顯示「功能開發中」提示
- 推薦使用現代瀏覽器以獲得最佳體驗

### 項目歷史
- **v1.0**: 初始版本，嵌套目錄結構
- **v2.0**: 項目重構，扁平化目錄結構
- **v3.0**: 添加 GitHub Pages 自動部署

## 📚 相關文檔

### 架構文檔
項目包含完整的架構設計文檔，位於 `docs/` 目錄：

- **[系統架構](docs/dmo_cms_architecture.md)**: 整體系統設計
- **[前端架構](docs/dmo_frontend_architecture.md)**: 前端技術架構
- **[後端架構](docs/dmo_backend_architecture.md)**: 後端設計方案
- **[產品需求](docs/dmo_cms_prd.md)**: 完整產品需求文檔
- **[用戶旅程](docs/dmo_user_journey.md)**: 用戶體驗設計

### 開發指南
- **[CLAUDE.md](CLAUDE.md)**: Claude Code 開發指南
- **[Admin Panel README](admin-panel-README.md)**: 原始組件文檔

## 🚀 快速體驗

1. **線上體驗**: 直接訪問 [Live Demo](https://catwu88.github.io/documents/)
2. **本地開發**: 克隆項目後運行 `npm install && npm run dev`
3. **一鍵部署**: 運行 `npm run deploy` 部署到 GitHub Pages

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改進這個演示項目。

### 開發流程
1. Fork 本項目
2. 創建功能分支: `git checkout -b feature/your-feature`
3. 提交更改: `git commit -am 'Add some feature'`
4. 推送到分支: `git push origin feature/your-feature`
5. 提交 Pull Request

## 📄 授權

MIT License

---

**DMO CMS Demo** - 展示現代化目的地管理系統的完整功能與用戶體驗

### 🌟 項目亮點
- ✅ **現代化技術棧**: React 18 + TypeScript + Vite
- ✅ **響應式設計**: 支持桌面和移動設備
- ✅ **多語言支持**: 中文/English/日本語
- ✅ **自動化部署**: GitHub Pages 一鍵部署
- ✅ **完整文檔**: 詳細的架構和開發文檔
- ✅ **演示數據**: 豐富的模擬數據展示功能