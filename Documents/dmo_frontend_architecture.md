# DMO CMS前端架構設計

## 1. 前端架構概述

### 1.1 架構模式
**採用單頁應用(SPA) + 微前端架構**
- **管理後台**: 功能豐富的管理界面
- **前台展示**: 面向用戶的展示網站
- **共享組件庫**: 統一的UI組件系統

### 1.2 技術選型

**核心框架**: React 18 + TypeScript
**構建工具**: Vite
**UI框架**: Ant Design 5.x
**狀態管理**: Zustand + React Query
**路由**: React Router v6
**地圖**: Google Maps React
**圖表**: Chart.js + Recharts
**樣式**: Tailwind CSS + CSS Modules

## 2. 項目結構設計

### 2.1 整體項目結構
```
dmo-cms-frontend/
├── apps/                          # 應用目錄
│   ├── admin/                     # 管理後台
│   └── public/                    # 前台展示
├── packages/                      # 共享包
│   ├── ui/                        # UI組件庫
│   ├── utils/                     # 工具函數
│   ├── types/                     # TypeScript類型
│   └── api/                       # API客戶端
├── shared/                        # 共享資源
│   ├── assets/                    # 靜態資源
│   ├── styles/                    # 全局樣式
│   └── constants/                 # 常量定義
└── tools/                         # 開發工具
    ├── build/                     # 構建配置
    └── testing/                   # 測試配置
```

### 2.2 管理後台結構 (apps/admin)
```
admin/
├── public/                        # 靜態資源
├── src/
│   ├── components/                # 業務組件
│   │   ├── Dashboard/             # 儀表板組件
│   │   ├── Business/              # 商家管理組件
│   │   ├── Event/                 # 活動管理組件
│   │   ├── Analytics/             # 數據分析組件
│   │   ├── Tag/                   # 標籤管理組件
│   │   └── User/                  # 用戶管理組件
│   ├── pages/                     # 頁面組件
│   │   ├── login/                 # 登入頁面
│   │   ├── dashboard/             # 儀表板頁面
│   │   ├── business/              # 商家管理頁面
│   │   ├── event/                 # 活動管理頁面
│   │   ├── analytics/             # 分析報表頁面
│   │   └── settings/              # 設定頁面
│   ├── hooks/                     # 自訂Hook
│   ├── services/                  # API服務
│   ├── stores/                    # 狀態管理
│   ├── utils/                     # 工具函數
│   ├── types/                     # 類型定義
│   ├── router/                    # 路由配置
│   ├── styles/                    # 樣式文件
│   ├── App.tsx                    # 根組件
│   └── main.tsx                   # 入口文件
├── package.json
└── vite.config.ts
```

### 2.3 前台展示結構 (apps/public)
```
public/
├── src/
│   ├── components/                # 業務組件
│   │   ├── BusinessCard/          # 商家卡片
│   │   ├── EventCard/             # 活動卡片
│   │   ├── SearchFilter/          # 搜索篩選
│   │   ├── MapView/               # 地圖視圖
│   │   └── Layout/                # 版面布局
│   ├── pages/                     # 頁面組件
│   │   ├── home/                  # 首頁
│   │   ├── business/              # 商家相關頁面
│   │   ├── event/                 # 活動相關頁面
│   │   └── search/                # 搜索頁面
│   ├── hooks/                     # 自訂Hook
│   ├── services/                  # API服務
│   ├── stores/                    # 狀態管理
│   └── utils/                     # 工具函數
```

## 3. 核心組件設計

### 3.1 管理後台核心組件

#### 3.1.1 儀表板組件 (Dashboard)
```typescript
// components/Dashboard/DashboardCard.tsx
interface DashboardCardProps {
  title: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  icon?: React.ReactNode;
}

// components/Dashboard/ChartContainer.tsx
interface ChartContainerProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: any[];
  loading?: boolean;
}

// components/Dashboard/RealtimeMetrics.tsx
interface RealtimeMetricsProps {
  metrics: {
    totalBusinesses: number;
    activeEvents: number;
    todayViews: number;
    conversionRate: number;
  };
}
```

#### 3.1.2 商家管理組件 (Business)
```typescript
// components/Business/BusinessTable.tsx
interface BusinessTableProps {
  businesses: Business[];
  loading?: boolean;
  onEdit: (business: Business) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: BusinessStatus) => void;
}

// components/Business/BusinessForm.tsx
interface BusinessFormProps {
  business?: Business;
  onSubmit: (data: BusinessFormData) => void;
  onCancel: () => void;
}

// components/Business/ExcelUpload.tsx
interface ExcelUploadProps {
  onUpload: (file: File) => void;
  uploading?: boolean;
  progress?: number;
}

// components/Business/BusinessAnalytics.tsx
interface BusinessAnalyticsProps {
  businessId: string;
  dateRange: [Date, Date];
}
```

#### 3.1.3 活動管理組件 (Event)
```typescript
// components/Event/EventForm.tsx
interface EventFormProps {
  event?: Event;
  onSubmit: (data: EventFormData) => void;
}

// components/Event/MapBusinessSelector.tsx
interface MapBusinessSelectorProps {
  businesses: Business[];
  selectedBusinesses: string[];
  eventGeofence?: Polygon;
  onBusinessToggle: (businessId: string) => void;
  onGeofenceChange: (geofence: Polygon) => void;
}

// components/Event/BusinessList.tsx
interface BusinessListProps {
  businesses: Business[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}
```

### 3.2 前台展示核心組件

#### 3.2.1 商家展示組件
```typescript
// components/BusinessCard/BusinessCard.tsx
interface BusinessCardProps {
  business: Business;
  layout: 'grid' | 'list';
  showAnalytics?: boolean;
}

// components/BusinessDetail/BusinessDetail.tsx
interface BusinessDetailProps {
  business: Business;
  reviews: Review[];
  analytics?: BusinessAnalytics;
}
```

#### 3.2.2 搜索與篩選組件
```typescript
// components/SearchFilter/SearchBox.tsx
interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
}

// components/SearchFilter/FilterPanel.tsx
interface FilterPanelProps {
  filters: FilterConfig[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}
```

## 4. 狀態管理設計

### 4.1 Zustand Store設計

#### 4.1.1 用戶狀態管理
```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  permissions: [],
  isAuthenticated: false,
  
  login: async (credentials) => {
    const response = await authAPI.login(credentials);
    set({
      user: response.user,
      token: response.token,
      permissions: response.permissions,
      isAuthenticated: true
    });
    localStorage.setItem('token', response.token);
  },
  
  logout: () => {
    set({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false
    });
    localStorage.removeItem('token');
  },
  
  checkPermission: (permission) => {
    return get().permissions.some(p => p.name === permission);
  }
}));
```

#### 4.1.2 商家狀態管理
```typescript
// stores/businessStore.ts
interface BusinessState {
  businesses: Business[];
  selectedBusiness: Business | null;
  filters: BusinessFilters;
  pagination: Pagination;
  loading: boolean;
  
  fetchBusinesses: (params?: FetchParams) => Promise<void>;
  createBusiness: (data: BusinessFormData) => Promise<void>;
  updateBusiness: (id: string, data: BusinessFormData) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  setFilters: (filters: BusinessFilters) => void;
  uploadExcel: (file: File) => Promise<UploadResult>;
}
```

### 4.2 React Query設計

#### 4.2.1 API查詢Hook
```typescript
// hooks/useBusinesses.ts
export const useBusinesses = (params?: BusinessQueryParams) => {
  return useQuery({
    queryKey: ['businesses', params],
    queryFn: () => businessAPI.getBusinesses(params),
    staleTime: 5 * 60 * 1000, // 5分鐘
    gcTime: 10 * 60 * 1000,   // 10分鐘
  });
};

// hooks/useBusinessAnalytics.ts
export const useBusinessAnalytics = (businessId: string, dateRange: DateRange) => {
  return useQuery({
    queryKey: ['business-analytics', businessId, dateRange],
    queryFn: () => analyticsAPI.getBusinessAnalytics(businessId, dateRange),
    enabled: !!businessId,
    refetchInterval: 30000, // 30秒自動刷新
  });
};
```

#### 4.2.2 Mutation Hook
```typescript
// hooks/useBusinessMutations.ts
export const useCreateBusiness = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: businessAPI.createBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      message.success('商家創建成功');
    },
    onError: (error) => {
      message.error(`創建失敗: ${error.message}`);
    }
  });
};
```

## 5. 路由設計

### 5.1 管理後台路由
```typescript
// router/adminRoutes.tsx
const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'businesses',
        children: [
          {
            index: true,
            element: <BusinessListPage />
          },
          {
            path: 'create',
            element: <BusinessFormPage />
          },
          {
            path: ':id/edit',
            element: <BusinessFormPage />
          },
          {
            path: ':id/analytics',
            element: <BusinessAnalyticsPage />
          },
          {
            path: 'upload',
            element: <ExcelUploadPage />
          }
        ]
      },
      {
        path: 'events',
        children: [
          {
            index: true,
            element: <EventListPage />
          },
          {
            path: 'create',
            element: <EventFormPage />
          },
          {
            path: ':id/edit',
            element: <EventFormPage />
          },
          {
            path: ':id/businesses',
            element: <EventBusinessPage />
          }
        ]
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />
      },
      {
        path: 'tags',
        element: <TagManagePage />
      },
      {
        path: 'users',
        element: <UserManagePage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
];
```

### 5.2 前台路由
```typescript
// router/publicRoutes.tsx
const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'businesses',
        children: [
          {
            index: true,
            element: <BusinessListPage />
          },
          {
            path: ':id',
            element: <BusinessDetailPage />
          }
        ]
      },
      {
        path: 'events',
        children: [
          {
            index: true,
            element: <EventListPage />
          },
          {
            path: ':id',
            element: <EventDetailPage />
          }
        ]
      },
      {
        path: 'search',
        element: <SearchPage />
      }
    ]
  }
];
```

## 6. UI/UX設計規範

### 6.1 設計系統
```typescript
// styles/theme.ts
export const theme = {
  colors: {
    primary: '#1890ff',
    secondary: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    text: {
      primary: '#262626',
      secondary: '#595959',
      disabled: '#bfbfbf'
    },
    background: {
      page: '#f0f2f5',
      container: '#ffffff',
      highlight: '#e6f7ff'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '1024px',
    lg: '1280px',
    xl: '1600px'
  }
};
```

### 6.2 響應式設計
```scss
// styles/responsive.scss
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
  
  @media (min-width: 768px) {
    padding: 0 24px;
  }
  
  @media (min-width: 1024px) {
    max-width: 1200px;
    padding: 0 32px;
  }
}

.grid {
  display: grid;
  gap: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

## 7. 性能優化

### 7.1 代碼分割
```typescript
// 路由級別懶加載
const BusinessListPage = lazy(() => import('../pages/business/BusinessListPage'));
const EventFormPage = lazy(() => import('../pages/event/EventFormPage'));

// 組件級別懶加載
const BusinessAnalytics = lazy(() => import('../components/Business/BusinessAnalytics'));
```

### 7.2 圖片優化
```typescript
// components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');
  
  useEffect(() => {
    const optimizedSrc = `${src}?w=${width}&h=${height}&q=${quality}`;
    setImageSrc(optimizedSrc);
  }, [src, width, height, quality]);
  
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
```

### 7.3 虛擬滾動
```typescript
// components/VirtualList.tsx
import { FixedSizeList as List } from 'react-window';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

const VirtualList = <T,>({ items, itemHeight, renderItem }: VirtualListProps<T>) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {renderItem(items[index], index)}
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

## 8. 測試策略

### 8.1 單元測試
```typescript
// components/__tests__/BusinessCard.test.tsx
import { render, screen } from '@testing-library/react';
import { BusinessCard } from '../BusinessCard';

describe('BusinessCard', () => {
  const mockBusiness = {
    id: '1',
    name: '測試商家',
    address: '台北市信義區',
    rating: 4.5
  };
  
  it('should render business information correctly', () => {
    render(<BusinessCard business={mockBusiness} layout="grid" />);
    
    expect(screen.getByText('測試商家')).toBeInTheDocument();
    expect(screen.getByText('台北市信義區')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });
});
```

### 8.2 整合測試
```typescript
// hooks/__tests__/useBusinesses.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBusinesses } from '../useBusinesses';

describe('useBusinesses', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false }
      }
    });
  });
  
  it('should fetch businesses successfully', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
    
    const { result } = renderHook(() => useBusinesses(), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

## 9. 開發與部署

### 9.1 開發環境配置
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          charts: ['chart.js', 'recharts']
        }
      }
    }
  }
});
```

### 9.2 CI/CD配置
```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - name: Deploy to CDN
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }}
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

---

**文檔版本**: v1.0  
**建立日期**: 2025年5月  
**前端架構師**: [待填入]  
**審核人**: [待填入]