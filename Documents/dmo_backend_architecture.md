# DMO CMS後端架構設計

## 1. 後端架構概述

### 1.1 架構模式
**採用微服務架構 + DDD領域驅動設計**
- **API Gateway**: 統一入口和路由管理
- **微服務群**: 按業務領域拆分的獨立服務
- **共享基礎設施**: 統一的監控、日誌、配置管理

### 1.2 技術選型

**核心框架**: Node.js + Express / Fastify
**編程語言**: TypeScript
**API文檔**: Swagger/OpenAPI 3.0
**驗證框架**: Joi / Zod
**ORM**: Prisma / TypeORM
**任務調度**: Bull Queue + Redis
**文件處理**: Multer + Sharp
**測試框架**: Jest + Supertest

## 2. 項目結構設計

### 2.1 整體項目結構
```
dmo-cms-backend/
├── apps/                          # 微服務應用
│   ├── api-gateway/               # API網關
│   ├── user-service/              # 用戶服務
│   ├── business-service/          # 商家服務
│   ├── event-service/             # 活動服務
│   ├── analytics-service/         # 分析服務
│   ├── tag-service/               # 標籤服務
│   ├── notification-service/      # 通知服務
│   └── file-service/              # 檔案服務
├── packages/                      # 共享包
│   ├── shared/                    # 共享模組
│   ├── database/                  # 數據庫配置
│   ├── redis/                     # Redis配置
│   ├── logger/                    # 日誌模組
│   ├── auth/                      # 認證模組
│   └── utils/                     # 工具函數
├── infrastructure/                # 基礎設施
│   ├── docker/                    # Docker配置
│   ├── k8s/                       # Kubernetes配置
│   ├── monitoring/                # 監控配置
│   └── database/                  # 數據庫遷移
├── docs/                          # 文檔
│   ├── api/                       # API文檔
│   ├── database/                  # 數據庫文檔
│   └── deployment/                # 部署文檔
└── tools/                         # 開發工具
    ├── scripts/                   # 腳本工具
    └── testing/                   # 測試工具
```

### 2.2 API Gateway結構
```
api-gateway/
├── src/
│   ├── routes/                    # 路由配置
│   │   ├── auth.routes.ts         # 認證路由
│   │   ├── business.routes.ts     # 商家路由
│   │   ├── event.routes.ts        # 活動路由
│   │   └── analytics.routes.ts    # 分析路由
│   ├── middleware/                # 中間件
│   │   ├── auth.middleware.ts     # 認證中間件
│   │   ├── cors.middleware.ts     # CORS中間件
│   │   ├── rate-limit.middleware.ts # 限流中間件
│   │   └── logger.middleware.ts   # 日誌中間件
│   ├── config/                    # 配置文件
│   │   ├── gateway.config.ts      # 網關配置
│   │   └── services.config.ts     # 服務配置
│   ├── utils/                     # 工具函數
│   │   ├── proxy.util.ts          # 代理工具
│   │   └── discovery.util.ts      # 服務發現
│   ├── app.ts                     # 應用入口
│   └── server.ts                  # 服務器啟動
├── Dockerfile
└── package.json
```

### 2.3 Business Service結構
```
business-service/
├── src/
│   ├── controllers/               # 控制器
│   │   ├── business.controller.ts
│   │   ├── excel.controller.ts
│   │   └── analytics.controller.ts
│   ├── services/                  # 業務邏輯服務
│   │   ├── business.service.ts
│   │   ├── excel.service.ts
│   │   ├── google-api.service.ts
│   │   └── analytics.service.ts
│   ├── repositories/              # 數據訪問層
│   │   ├── business.repository.ts
│   │   └── analytics.repository.ts
│   ├── models/                    # 數據模型
│   │   ├── business.model.ts
│   │   └── business-analytics.model.ts
│   ├── dto/                       # 數據傳輸對象
│   │   ├── business.dto.ts
│   │   └── excel-upload.dto.ts
│   ├── validators/                # 驗證器
│   │   ├── business.validator.ts
│   │   └── excel.validator.ts
│   ├── routes/                    # 路由
│   │   └── business.routes.ts
│   ├── middleware/                # 中間件
│   │   └── validation.middleware.ts
│   ├── utils/                     # 工具函數
│   │   ├── excel-parser.util.ts
│   │   └── google-api.util.ts
│   ├── config/                    # 配置
│   │   └── database.config.ts
│   ├── tests/                     # 測試文件
│   │   ├── unit/
│   │   └── integration/
│   ├── app.ts
│   └── server.ts
├── prisma/                        # Prisma配置
│   ├── schema.prisma
│   └── migrations/
├── Dockerfile
└── package.json
```

## 3. 核心服務設計

### 3.1 API Gateway服務

#### 3.1.1 路由配置
```typescript
// routes/business.routes.ts
import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 商家相關路由代理
router.use('/businesses', 
  authMiddleware,
  createProxyMiddleware({
    target: process.env.BUSINESS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/businesses': '/businesses'
    }
  })
);

export default router;
```

#### 3.1.2 認證中間件
```typescript
// middleware/auth.middleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    permissions: string[];
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const permissionMiddleware = (requiredPermission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.permissions.includes(requiredPermission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### 3.2 Business Service

#### 3.2.1 商家控制器
```typescript
// controllers/business.controller.ts
import { Request, Response } from 'express';
import { BusinessService } from '../services/business.service';
import { ExcelService } from '../services/excel.service';
import { CreateBusinessDto, UpdateBusinessDto } from '../dto/business.dto';

export class BusinessController {
  constructor(
    private businessService: BusinessService,
    private excelService: ExcelService
  ) {}

  async getBusinesses(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, category, search } = req.query;
      
      const result = await this.businessService.getBusinesses({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        category: category as string,
        search: search as string
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createBusiness(req: Request, res: Response) {
    try {
      const businessData: CreateBusinessDto = req.body;
      const userId = req.user?.id;
      
      const business = await this.businessService.createBusiness(businessData, userId);
      
      res.status(201).json(business);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async uploadExcel(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Excel file required' });
      }
      
      const result = await this.excelService.processExcelFile(req.file);
      
      res.json({
        message: 'Excel processing started',
        jobId: result.jobId,
        totalRows: result.totalRows
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUploadStatus(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const status = await this.excelService.getProcessingStatus(jobId);
      
      res.json(status);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}
```

#### 3.2.2 商家服務層
```typescript
// services/business.service.ts
import { BusinessRepository } from '../repositories/business.repository';
import { GoogleApiService } from './google-api.service';
import { TagService } from './tag.service';
import { CreateBusinessDto, UpdateBusinessDto } from '../dto/business.dto';

export class BusinessService {
  constructor(
    private businessRepository: BusinessRepository,
    private googleApiService: GoogleApiService,
    private tagService: TagService
  ) {}

  async getBusinesses(params: GetBusinessesParams) {
    const { businesses, total } = await this.businessRepository.findMany(params);
    
    return {
      data: businesses,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit)
    };
  }

  async createBusiness(data: CreateBusinessDto, userId: string) {
    // 1. 創建基本商家資料
    const business = await this.businessRepository.create({
      ...data,
      createdBy: userId,
      status: 'pending'
    });

    // 2. 嘗試從Google獲取額外資訊
    try {
      const googleData = await this.googleApiService.getPlaceDetails(
        data.name,
        data.address
      );
      
      if (googleData) {
        await this.businessRepository.update(business.id, {
          googlePlaceId: googleData.placeId,
          phone: googleData.phone || data.phone,
          website: googleData.website || data.website,
          rating: googleData.rating,
          openingHours: googleData.openingHours,
          photos: googleData.photos
        });
      }
    } catch (error) {
      console.error('Failed to fetch Google data:', error);
    }

    // 3. 自動生成標籤
    try {
      const autoTags = await this.tagService.generateAutoTags(business);
      await this.tagService.assignTags(business.id, autoTags);
    } catch (error) {
      console.error('Failed to generate auto tags:', error);
    }

    return await this.businessRepository.findById(business.id);
  }

  async updateBusinessStatus(businessId: string, status: BusinessStatus, userId: string) {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    const updatedBusiness = await this.businessRepository.update(businessId, {
      status,
      updatedBy: userId,
      statusUpdatedAt: new Date()
    });

    // 記錄狀態變更
    await this.auditLogService.log({
      userId,
      action: 'STATUS_CHANGE',
      resourceType: 'business',
      resourceId: businessId,
      oldValues: { status: business.status },
      newValues: { status }
    });

    return updatedBusiness;
  }
}
```

#### 3.2.3 Excel處理服務
```typescript
// services/excel.service.ts
import * as XLSX from 'xlsx';
import { Queue } from 'bull';
import { BusinessService } from './business.service';

export class ExcelService {
  private processQueue: Queue;

  constructor(private businessService: BusinessService) {
    this.processQueue = new Queue('excel processing', {
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      }
    });

    this.setupQueueProcessor();
  }

  async processExcelFile(file: Express.Multer.File) {
    // 1. 解析Excel文件
    const workbook = XLSX.read(file.buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // 2. 驗證數據格式
    const validatedData = this.validateExcelData(data);

    // 3. 創建處理任務
    const job = await this.processQueue.add('process-businesses', {
      businesses: validatedData,
      totalRows: validatedData.length
    });

    return {
      jobId: job.id,
      totalRows: validatedData.length
    };
  }

  private validateExcelData(data: any[][]) {
    const headers = data[0];
    const requiredColumns = ['商家名稱', '地址'];
    
    // 檢查必要欄位
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // 轉換數據格式
    const businesses = data.slice(1).map((row, index) => {
      const businessData: any = {};
      headers.forEach((header, colIndex) => {
        businessData[header] = row[colIndex];
      });

      // 驗證必要欄位
      if (!businessData['商家名稱'] || !businessData['地址']) {
        throw new Error(`Row ${index + 2}: Missing required data`);
      }

      return {
        name: businessData['商家名稱'],
        address: businessData['地址'],
        phone: businessData['電話'] || null,
        website: businessData['網站'] || null,
        description: businessData['描述'] || null
      };
    });

    return businesses;
  }

  private setupQueueProcessor() {
    this.processQueue.process('process-businesses', async (job) => {
      const { businesses, totalRows } = job.data;
      const results = {
        success: 0,
        failed: 0,
        errors: []
      };

      for (let i = 0; i < businesses.length; i++) {
        try {
          await this.businessService.createBusiness(businesses[i], 'system');
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            row: i + 2,
            data: businesses[i],
            error: error.message
          });
        }

        // 更新進度
        const progress = Math.floor((i + 1) / businesses.length * 100);
        job.progress(progress);
      }

      return results;
    });
  }

  async getProcessingStatus(jobId: string) {
    const job = await this.processQueue.getJob(jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }

    return {
      id: job.id,
      status: await job.getState(),
      progress: job.progress(),
      data: job.returnvalue,
      createdAt: new Date(job.timestamp),
      processedOn: job.processedOn ? new Date(job.processedOn) : null,
      finishedOn: job.finishedOn ? new Date(job.finishedOn) : null
    };
  }
}
```

### 3.3 Google API Service

#### 3.3.1 Google Places整合
```typescript
// services/google-api.service.ts
import { Client } from '@googlemaps/google-maps-services-js';

export class GoogleApiService {
  private client: Client;

  constructor() {
    this.client = new Client({});
  }

  async getPlaceDetails(businessName: string, address: string) {
    try {
      // 1. 搜索商家
      const searchResponse = await this.client.findPlaceFromText({
        params: {
          input: `${businessName} ${address}`,
          inputtype: 'textquery',
          fields: ['place_id', 'name', 'formatted_address'],
          key: process.env.GOOGLE_MAPS_API_KEY!
        }
      });

      if (!searchResponse.data.candidates.length) {
        return null;
      }

      const placeId = searchResponse.data.candidates[0].place_id;

      // 2. 獲取詳細資訊
      const detailsResponse = await this.client.placeDetails({
        params: {
          place_id: placeId,
          fields: [
            'name',
            'formatted_address',
            'formatted_phone_number',
            'website',
            'rating',
            'opening_hours',
            'photos',
            'reviews',
            'geometry'
          ],
          key: process.env.GOOGLE_MAPS_API_KEY!
        }
      });

      const place = detailsResponse.data.result;

      return {
        placeId,
        name: place.name,
        address: place.formatted_address,
        phone: place.formatted_phone_number,
        website: place.website,
        rating: place.rating,
        openingHours: place.opening_hours?.weekday_text,
        photos: place.photos?.map(photo => ({
          reference: photo.photo_reference,
          width: photo.width,
          height: photo.height
        })),
        reviews: place.reviews?.map(review => ({
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          time: review.time
        })),
        location: {
          lat: place.geometry?.location.lat,
          lng: place.geometry?.location.lng
        }
      };
    } catch (error) {
      console.error('Google API Error:', error);
      throw new Error('Failed to fetch Google Places data');
    }
  }

  async getPhotoUrl(photoReference: string, maxWidth: number = 400) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  }

  async geocodeAddress(address: string) {
    try {
      const response = await this.client.geocode({
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY!
        }
      });

      if (response.data.results.length === 0) {
        return null;
      }

      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: response.data.results[0].formatted_address
      };
    } catch (error) {
      console.error('Geocoding Error:', error);
      return null;
    }
  }
}
```

### 3.4 Analytics Service

#### 3.4.1 分析數據收集
```typescript
// services/analytics.service.ts
import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
  constructor(private analyticsRepository: AnalyticsRepository) {}

  async trackBusinessView(businessId: string, sessionId: string, userAgent?: string) {
    await this.analyticsRepository.recordEvent({
      type: 'business_view',
      businessId,
      sessionId,
      userAgent,
      timestamp: new Date()
    });
  }

  async trackBusinessClick(businessId: string, clickType: string, sessionId: string) {
    await this.analyticsRepository.recordEvent({
      type: 'business_click',
      businessId,
      sessionId,
      metadata: { clickType },
      timestamp: new Date()
    });
  }

  async getBusinessAnalytics(businessId: string, dateRange: DateRange) {
    const analytics = await this.analyticsRepository.getBusinessMetrics(
      businessId,
      dateRange
    );

    return {
      businessId,
      dateRange,
      metrics: {
        totalViews: analytics.totalViews,
        uniqueVisitors: analytics.uniqueVisitors,
        avgTimeOnPage: analytics.avgTimeOnPage,
        clickThroughRate: analytics.totalClicks / analytics.totalViews,
        conversionRate: analytics.conversions / analytics.totalViews,
        popularClickTypes: analytics.clickTypeDistribution
      },
      trends: analytics.dailyMetrics
    };
  }

  async getDashboardMetrics() {
    const metrics = await this.analyticsRepository.getDashboardData();

    return {
      totalBusinesses: metrics.totalBusinesses,
      totalEvents: metrics.totalEvents,
      todayViews: metrics.todayViews,
      todayUniqueVisitors: metrics.todayUniqueVisitors,
      topBusinesses: metrics.topBusinesses,
      recentActivity: metrics.recentActivity
    };
  }
}
```

### 3.5 Event Service

#### 3.5.1 活動管理服務
```typescript
// services/event.service.ts
import { EventRepository } from '../repositories/event.repository';
import { BusinessRepository } from '../repositories/business.repository';

export class EventService {
  constructor(
    private eventRepository: EventRepository,
    private businessRepository: BusinessRepository
  ) {}

  async createEvent(eventData: CreateEventDto, userId: string) {
    const event = await this.eventRepository.create({
      ...eventData,
      createdBy: userId,
      status: 'draft'
    });

    return event;
  }

  async getBusinessesInArea(geofence: GeoPolygon) {
    return await this.businessRepository.findInGeofence(geofence);
  }

  async addBusinessesToEvent(eventId: string, businessIds: string[]) {
    // 驗證活動存在
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // 驗證商家存在且已發布
    const businesses = await this.businessRepository.findByIds(businessIds);
    const publishedBusinesses = businesses.filter(b => b.status === 'published');

    // 批次添加商家到活動
    await this.eventRepository.addBusinesses(eventId, publishedBusinesses.map(b => b.id));

    return {
      eventId,
      addedCount: publishedBusinesses.length,
      skippedCount: businessIds.length - publishedBusinesses.length
    };
  }

  async getEventBusinesses(eventId: string) {
    const eventBusinesses = await this.eventRepository.getEventBusinesses(eventId);
    
    return eventBusinesses.map(eb => ({
      ...eb.business,
      eventMetadata: {
        addedAt: eb.addedAt,
        featured: eb.featured,
        order: eb.order
      }
    }));
  }
}
```

## 4. 數據庫設計

### 4.1 Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  roleId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  role      Role       @relation(fields: [roleId], references: [id])
  businesses Business[] @relation("CreatedBy")
  events     Event[]    @relation("CreatedBy")
  auditLogs  AuditLog[]

  @@map("users")
}

model Role {
  id          String @id @default(cuid())
  name        String @unique
  description String?
  permissions Json

  users User[]

  @@map("roles")
}

model Business {
  id            String   @id @default(cuid())
  name          String
  address       String
  phone         String?
  website       String?
  description   String?
  latitude      Decimal?
  longitude     Decimal?
  googlePlaceId String?
  status        BusinessStatus @default(PENDING)
  createdBy     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  creator       User @relation("CreatedBy", fields: [createdBy], references: [id])
  photos        BusinessPhoto[]
  tags          BusinessTag[]
  analytics     BusinessAnalytics[]
  eventBusinesses EventBusiness[]

  @@map("businesses")
}

model BusinessPhoto {
  id         String  @id @default(cuid())
  businessId String
  url        String
  isPrimary  Boolean @default(false)
  sortOrder  Int     @default(0)

  business Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@map("business_photos")
}

model Tag {
  id          String  @id @default(cuid())
  name        String  @unique
  category    String
  isSystem    Boolean @default(false)
  description String?

  businessTags BusinessTag[]

  @@map("tags")
}

model BusinessTag {
  businessId String
  tagId      String

  business Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  tag      Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([businessId, tagId])
  @@map("business_tags")
}

model Event {
  id          String   @id @default(cuid())
  name        String
  description String?
  startDate   DateTime?
  endDate     DateTime?
  geofence    Json?    // GeoJSON polygon
  status      EventStatus @default(DRAFT)
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  creator         User @relation("CreatedBy", fields: [createdBy], references: [id])
  eventBusinesses EventBusiness[]

  @@map("events")
}

model EventBusiness {
  eventId    String
  businessId String
  featured   Boolean @default(false)
  order      Int     @default(0)
  addedAt    DateTime @default(now())

  event    Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  business Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@id([eventId, businessId])
  @@map("event_businesses")
}

model BusinessAnalytics {
  id               String   @id @default(cuid())
  businessId       String
  date             DateTime @db.Date
  pageViews        Int      @default(0)
  uniqueVisitors   Int      @default(0)
  avgTimeOnPage    Int      @default(0) // seconds
  totalClicks      Int      @default(0)
  conversions      Int      @default(0)

  business Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@unique([businessId, date])
  @@map("business_analytics")
}

model AuditLog {
  id           String   @id @default(cuid())
  userId       String
  action       String
  resourceType String
  resourceId   String?
  oldValues    Json?
  newValues    Json?
  ipAddress    String?
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@map("audit_logs")
}

enum BusinessStatus {
  PENDING
  APPROVED
  PUBLISHED
  REJECTED
}

enum EventStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### 4.2 Repository模式實現
```typescript
// repositories/business.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';

export class BusinessRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.BusinessCreateInput) {
    return await this.prisma.business.create({
      data,
      include: {
        photos: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  async findMany(params: {
    page: number;
    limit: number;
    status?: string;
    category?: string;
    search?: string;
  }) {
    const { page, limit, status, category, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.BusinessWhereInput = {};

    if (status) {
      where.status = status as BusinessStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.tags = {
        some: {
          tag: {
            category: category
          }
        }
      };
    }

    const [businesses, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        skip,
        take: limit,
        include: {
          photos: true,
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.business.count({ where })
    ]);

    return { businesses, total };
  }

  async findInGeofence(geofence: any) {
    // PostgreSQL + PostGIS查詢
    const result = await this.prisma.$queryRaw`
      SELECT * FROM businesses 
      WHERE ST_Contains(
        ST_GeomFromGeoJSON(${JSON.stringify(geofence)}),
        ST_Point(longitude::double precision, latitude::double precision)
      )
    `;

    return result;
  }

  async update(id: string, data: Prisma.BusinessUpdateInput) {
    return await this.prisma.business.update({
      where: { id },
      data,
      include: {
        photos: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  async delete(id: string) {
    return await this.prisma.business.delete({
      where: { id }
    });
  }
}
```

## 5. API設計規範

### 5.1 RESTful API設計
```typescript
// routes/business.routes.ts
import { Router } from 'express';
import { BusinessController } from '../controllers/business.controller';
import { authMiddleware, permissionMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { createBusinessSchema, updateBusinessSchema } from '../validators/business.validator';

const router = Router();
const businessController = new BusinessController();

// GET /businesses - 獲取商家列表
router.get('/', 
  authMiddleware,
  businessController.getBusinesses
);

// POST /businesses - 創建商家
router.post('/',
  authMiddleware,
  permissionMiddleware('business:create'),
  validationMiddleware(createBusinessSchema),
  businessController.createBusiness
);

// PUT /businesses/:id - 更新商家
router.put('/:id',
  authMiddleware,
  permissionMiddleware('business:update'),
  validationMiddleware(updateBusinessSchema),
  businessController.updateBusiness
);

// DELETE /businesses/:id - 刪除商家
router.delete('/:id',
  authMiddleware,
  permissionMiddleware('business:delete'),
  businessController.deleteBusiness
);

// POST /businesses/upload - Excel批次上傳
router.post('/upload',
  authMiddleware,
  permissionMiddleware('business:upload'),
  upload.single('excel'),
  businessController.uploadExcel
);

// GET /businesses/upload/:jobId/status - 獲取上傳狀態
router.get('/upload/:jobId/status',
  authMiddleware,
  businessController.getUploadStatus
);

// PUT /businesses/:id/status - 更新商家狀態
router.put('/:id/status',
  authMiddleware,
  permissionMiddleware('business:manage'),
  businessController.updateStatus
);

// GET /businesses/:id/analytics - 獲取商家分析
router.get('/:id/analytics',
  authMiddleware,
  permissionMiddleware('analytics:read'),
  businessController.getAnalytics
);

export default router;
```

### 5.2 API響應格式
```typescript
// utils/response.util.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
  };
}

export class ResponseUtil {
  static success<T>(data: T, meta?: any): ApiResponse<T> {
    return {
      success: true,
      data,
      meta: {
        ...meta,
        timestamp: new Date().toISOString()
      }
    };
  }

  static error(code: string, message: string, details?: any): ApiResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
  ): ApiResponse<T[]> {
    return {
      success: true,
      data,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        timestamp: new Date().toISOString()
      }
    };
  }
}
```

## 6. 安全性實現

### 6.1 JWT認證實現
```typescript
// services/auth.service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name
      },
      token
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await this.userRepository.findById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      const newToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role.name,
          permissions: user.role.permissions
        },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      return { token: newToken };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
```

### 6.2 輸入驗證
```typescript
// validators/business.validator.ts
import Joi from 'joi';

export const createBusinessSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  address: Joi.string().required().min(1).max(500),
  phone: Joi.string().optional().pattern(/^[\d\s\-\+\(\)]+$/),
  website: Joi.string().optional().uri(),
  description: Joi.string().optional().max(2000),
  latitude: Joi.number().optional().min(-90).max(90),
  longitude: Joi.number().optional().min(-180).max(180)
});

export const updateBusinessSchema = createBusinessSchema.fork(
  ['name', 'address'], 
  (schema) => schema.optional()
);

// middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        }
      });
    }
    
    next();
  };
};
```

## 7. 監控與日誌

### 7.1 應用監控
```typescript
// middleware/monitoring.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = performance.now();
  
  res.on('finish', () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // 記錄請求指標
    console.log({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: Math.round(duration),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    
    // 發送到監控系統 (Prometheus/DataDog等)
    if (process.env.MONITORING_ENABLED === 'true') {
      // sendMetrics(...)
    }
  });
  
  next();
};
```

### 7.2 結構化日誌
```typescript
// utils/logger.util.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'dmo-cms-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export { logger };

// 使用範例
logger.info('Business created', { 
  businessId: '123', 
  userId: 'user456',
  action: 'create_business'
});

logger.error('Failed to process Excel file', {
  error: error.message,
  stack: error.stack,
  fileName: file.originalname
});
```

## 8. 部署配置

### 8.1 Docker配置

#### 8.1.1 Business Service Dockerfile
```dockerfile
# apps/business-service/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# 複製package文件
COPY package*.json ./
COPY prisma ./prisma/

# 安裝依賴
RUN npm ci --only=production

# 複製源代碼
COPY . .

# 生成Prisma客戶端
RUN npx prisma generate

# 建立應用
RUN npm run build

# 生產環境
FROM node:18-alpine AS production

WORKDIR /app

# 複製構建產物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

#### 8.1.2 Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  # 數據庫
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: dmo_cms
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # API Gateway
  api-gateway:
    build: ./apps/api-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-jwt-secret
      - BUSINESS_SERVICE_URL=http://business-service:3001
      - EVENT_SERVICE_URL=http://event-service:3002
    depends_on:
      - business-service
      - event-service

  # Business Service
  business-service:
    build: ./apps/business-service
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/dmo_cms
      - REDIS_URL=redis://redis:6379
      - GOOGLE_MAPS_API_KEY=your-google-api-key
    depends_on:
      - postgres
      - redis

  # Event Service
  event-service:
    build: ./apps/event-service
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/dmo_cms
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

### 8.2 Kubernetes配置
```yaml
# k8s/business-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: business-service
  labels:
    app: business-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: business-service
  template:
    metadata:
      labels:
        app: business-service
    spec:
      containers:
      - name: business-service
        image: dmo-cms/business-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: redis-config
              key: url
        - name: GOOGLE_MAPS_API_KEY
          valueFrom:
            secretKeyRef:
              name: google-api-secret
              key: maps-api-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: business-service
spec:
  selector:
    app: business-service
  ports:
    - protocol: TCP
      port: 3001
      targetPort: 3001
```

### 8.3 CI/CD Pipeline
```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths: ['apps/**', 'packages/**']
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run database migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run tests
        run: npm run test:ci
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push images
        run: |
          docker buildx build --platform linux/amd64,linux/arm64 \
            -t ghcr.io/your-org/dmo-cms-business-service:${{ github.sha }} \
            -t ghcr.io/your-org/dmo-cms-business-service:latest \
            --push ./apps/business-service
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/business-service \
            business-service=ghcr.io/your-org/dmo-cms-business-service:${{ github.sha }}
```

---

**文檔版本**: v1.0  
**建立日期**: 2025年5月  
**後端架構師**: [待填入]  
**審核人**: [待填入]