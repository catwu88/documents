import type { Business, Event, DashboardMetrics, Tag, ActivityLog } from '../types';

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: '大稻埕碼頭咖啡',
    address: '台北市大同區民生西路207號',
    phone: '02-2555-1234',
    website: 'https://dadaocheng-cafe.com',
    description: '位於大稻埕碼頭旁的特色咖啡廳，提供精品咖啡與台式輕食，可欣賞淡水河美景。',
    specialOffer: '新客戶享首次消費9折優惠！平日下午茶時段買一送一，會員生日當月免費升級大杯咖啡 ☕',
    latitude: 25.0569,
    longitude: 121.5081,
    status: 'published',
    category: '餐飲',
    tags: ['咖啡廳', '河景', '台式料理', '網美景點'],
    photos: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400'
    ],
    rating: 4.5,
    reviewCount: 128,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-20T14:22:00Z',
    analytics: {
      views: 2340,
      clicks: 156,
      conversions: 23,
      avgTimeOnPage: 145,
      clickThroughRate: 6.7,
      conversionRate: 14.7
    }
  },
  {
    id: '2',
    name: '迪化街老店茶行',
    address: '台北市大同區迪化街一段223號',
    phone: '02-2558-9876',
    description: '百年老店，專售台灣高山茶與傳統茶具，提供專業茶葉知識與品茶體驗。',
    specialOffer: '購買任一款高山茶即贈送精美茶具組！滿3000元免運費，老客戶享終身95折優惠 🍵',
    latitude: 25.0558,
    longitude: 121.5099,
    status: 'published',
    category: '購物',
    tags: ['茶葉', '百年老店', '文化體驗', '伴手禮'],
    photos: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400'
    ],
    rating: 4.8,
    reviewCount: 89,
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-03-18T11:45:00Z',
    analytics: {
      views: 1890,
      clicks: 134,
      conversions: 31,
      avgTimeOnPage: 203,
      clickThroughRate: 7.1,
      conversionRate: 23.1
    }
  },
  {
    id: '3',
    name: '霞海城隍廟',
    address: '台北市大同區迪化街一段61號',
    phone: '02-2558-0346',
    description: '大稻埕著名廟宇，以月老聞名，是祈求姻緣的熱門景點，香火鼎盛。',
    latitude: 25.0555,
    longitude: 121.5102,
    status: 'published',
    category: '景點',
    tags: ['廟宇', '月老', '祈福', '文化古蹟'],
    photos: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    ],
    rating: 4.6,
    reviewCount: 456,
    createdAt: '2024-01-20T16:20:00Z',
    updatedAt: '2024-03-15T13:30:00Z',
    analytics: {
      views: 5670,
      clicks: 423,
      conversions: 89,
      avgTimeOnPage: 178,
      clickThroughRate: 7.5,
      conversionRate: 21.0
    }
  },
  {
    id: '4',
    name: '大稻埕戲苑',
    address: '台北市大同區迪化街一段21號',
    phone: '02-2556-9101',
    description: '傳統戲曲表演場所，定期舉辦歌仔戲、布袋戲等台灣傳統藝術表演。',
    specialOffer: '學生及65歲以上長者享門票半價優惠！團體10人以上8折，每月第一個週日免費入場參觀 🎭',
    latitude: 25.0562,
    longitude: 121.5095,
    status: 'approved',
    category: '文化',
    tags: ['戲曲', '傳統藝術', '表演', '文化體驗'],
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    ],
    rating: 4.3,
    reviewCount: 67,
    createdAt: '2024-03-01T14:10:00Z',
    updatedAt: '2024-03-22T10:15:00Z',
    analytics: {
      views: 890,
      clicks: 45,
      conversions: 12,
      avgTimeOnPage: 156,
      clickThroughRate: 5.1,
      conversionRate: 26.7
    }
  },
  {
    id: '5',
    name: '永樂市場',
    address: '台北市大同區迪化街一段21號',
    description: '傳統布料批發市場，各式布料、服飾配件應有盡有，是設計師與手作愛好者的天堂。',
    specialOffer: '週二至週四批發價再打9折！購買滿1000元贈送手作工具包，設計師憑證享專業折扣 ✂️',
    latitude: 25.0565,
    longitude: 121.5088,
    status: 'pending',
    category: '購物',
    tags: ['市場', '布料', '批發', '手作材料'],
    photos: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
    ],
    rating: 4.2,
    reviewCount: 34,
    createdAt: '2024-03-25T11:30:00Z',
    updatedAt: '2024-03-25T11:30:00Z',
    analytics: {
      views: 567,
      clicks: 23,
      conversions: 5,
      avgTimeOnPage: 89,
      clickThroughRate: 4.1,
      conversionRate: 21.7
    }
  },
  {
    id: '6',
    name: '台北故事館',
    address: '台北市中山區中山北路三段181-1號',
    phone: '02-2587-5565',
    description: '英式都鐸風格建築，展示台北城市發展歷史，是重要的文化資產。',
    latitude: 25.0726,
    longitude: 121.5264,
    status: 'published',
    category: '景點',
    tags: ['博物館', '歷史建築', '文化', '教育'],
    photos: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    ],
    rating: 4.4,
    reviewCount: 203,
    createdAt: '2024-02-10T13:45:00Z',
    updatedAt: '2024-03-19T16:20:00Z',
    analytics: {
      views: 3240,
      clicks: 198,
      conversions: 42,
      avgTimeOnPage: 234,
      clickThroughRate: 6.1,
      conversionRate: 21.2
    }
  },
  {
    id: '7',
    name: '寧夏夜市',
    address: '台北市大同區寧夏路',
    phone: '02-2558-0525',
    description: '台北知名夜市，以傳統台灣小吃聞名，蚵仔煎、滷肉飯等美食應有盡有。',
    specialOffer: '週末限定！消費滿200元即可參加摸彩活動，每日前100名顧客享小吃9折優惠 🎪',
    latitude: 25.0566,
    longitude: 121.5155,
    status: 'published',
    category: '餐飲',
    tags: ['夜市', '小吃', '台灣美食', '平價'],
    photos: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'
    ],
    rating: 4.7,
    reviewCount: 892,
    createdAt: '2024-01-05T19:30:00Z',
    updatedAt: '2024-03-21T20:15:00Z',
    analytics: {
      views: 8950,
      clicks: 567,
      conversions: 134,
      avgTimeOnPage: 167,
      clickThroughRate: 6.3,
      conversionRate: 23.6
    }
  },
  {
    id: '8',
    name: '台北當代藝術館',
    address: '台北市大同區長安西路39號',
    phone: '02-2552-3721',
    description: '台灣首座當代藝術館，展示國內外當代藝術作品，推廣現代藝術文化。',
    latitude: 25.0526,
    longitude: 121.5200,
    status: 'published',
    category: '文化',
    tags: ['美術館', '當代藝術', '展覽', '文化教育'],
    photos: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'
    ],
    rating: 4.5,
    reviewCount: 156,
    createdAt: '2024-02-20T11:00:00Z',
    updatedAt: '2024-03-18T14:30:00Z',
    analytics: {
      views: 2180,
      clicks: 145,
      conversions: 28,
      avgTimeOnPage: 298,
      clickThroughRate: 6.7,
      conversionRate: 19.3
    }
  },
  {
    id: '9',
    name: '建成圓環',
    address: '台北市大同區重慶北路一段',
    description: '台北歷史悠久的圓環，重新規劃後成為美食廣場，保留傳統小吃文化。',
    latitude: 25.0533,
    longitude: 121.5155,
    status: 'approved',
    category: '餐飲',
    tags: ['圓環', '美食廣場', '傳統小吃', '歷史'],
    photos: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
    ],
    rating: 4.1,
    reviewCount: 78,
    createdAt: '2024-03-05T15:20:00Z',
    updatedAt: '2024-03-20T12:45:00Z',
    analytics: {
      views: 1456,
      clicks: 89,
      conversions: 18,
      avgTimeOnPage: 134,
      clickThroughRate: 6.1,
      conversionRate: 20.2
    }
  },
  {
    id: '10',
    name: '台北孔廟',
    address: '台北市大同區大龍街275號',
    phone: '02-2592-3934',
    description: '台北市的孔廟，每年舉辦祭孔大典，是重要的文化教育場所。',
    latitude: 25.0733,
    longitude: 121.5155,
    status: 'published',
    category: '景點',
    tags: ['孔廟', '文化古蹟', '教育', '祭典'],
    photos: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    ],
    rating: 4.3,
    reviewCount: 234,
    createdAt: '2024-01-30T10:15:00Z',
    updatedAt: '2024-03-16T13:20:00Z',
    analytics: {
      views: 3890,
      clicks: 267,
      conversions: 56,
      avgTimeOnPage: 189,
      clickThroughRate: 6.9,
      conversionRate: 21.0
    }
  },
  {
    id: '11',
    name: '大龍峒保安宮',
    address: '台北市大同區哈密街61號',
    phone: '02-2595-1676',
    description: '台北三大廟宇之一，主祀保生大帝，建築精美，香火鼎盛。',
    latitude: 25.0744,
    longitude: 121.5155,
    status: 'pending',
    category: '景點',
    tags: ['廟宇', '保生大帝', '古蹟', '宗教'],
    photos: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    ],
    rating: 4.6,
    reviewCount: 189,
    createdAt: '2024-03-28T09:30:00Z',
    updatedAt: '2024-03-28T09:30:00Z',
    analytics: {
      views: 2340,
      clicks: 156,
      conversions: 34,
      avgTimeOnPage: 167,
      clickThroughRate: 6.7,
      conversionRate: 21.8
    }
  },
  {
    id: '12',
    name: '圓山花博公園',
    address: '台北市中山區玉門街1號',
    phone: '02-2182-8886',
    description: '2010年台北國際花卉博覽會場地，現為大型公園，適合休閒散步。',
    latitude: 25.0728,
    longitude: 121.5200,
    status: 'approved',
    category: '景點',
    tags: ['公園', '花博', '休閒', '親子'],
    photos: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
    ],
    rating: 4.2,
    reviewCount: 345,
    createdAt: '2024-02-25T14:00:00Z',
    updatedAt: '2024-03-22T11:30:00Z',
    analytics: {
      views: 4560,
      clicks: 298,
      conversions: 67,
      avgTimeOnPage: 201,
      clickThroughRate: 6.5,
      conversionRate: 22.5
    }
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    name: '大稻埕煙火季2024',
    description: '一年一度的大稻埕煙火節，結合音樂表演與煙火，為大稻埕帶來最美的夜晚。',
    category: '節慶',
    location: '大稻埕碼頭',
    address: '台北市大同區延平北路一段',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    startTime: '18:00',
    endTime: '22:00',
    status: 'published',
    organizer: '台北市政府',
    maxAttendees: 5000,
    price: 0,
    registrationRequired: false,
    contactPhone: '02-2720-8889',
    contactEmail: 'events@taipei.gov.tw',
    website: 'https://dadaocheng-fireworks.taipei',
    photos: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&h=600&fit=crop'
    ],
    tags: ['煙火', '音樂', '節慶', '免費'],
    attendees: 1250,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
    businessIds: ['1', '2', '3', '4', '5'],
    analytics: {
      participatingBusinesses: 5,
      totalViews: 12450,
      totalClicks: 890,
      avgEngagement: 7.2,
      views: 12450,
      clicks: 890,
      shares: 156,
      conversionRate: 7.2
    }
  },
  {
    id: '2',
    name: '迪化街年貨大街',
    description: '傳統年貨採購聖地，各式南北貨、年節食品應有盡有。',
    category: '市集',
    location: '迪化街',
    address: '台北市大同區迪化街一段',
    startDate: '2024-01-15',
    endDate: '2024-02-10',
    startTime: '09:00',
    endTime: '21:00',
    status: 'archived',
    organizer: '迪化街商圈發展協會',
    maxAttendees: undefined,
    price: 0,
    registrationRequired: false,
    contactPhone: '02-2553-9441',
    contactEmail: 'info@dihua.org.tw',
    website: 'https://dihua.org.tw',
    photos: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2ac5?w=800&h=600&fit=crop'
    ],
    tags: ['年貨', '傳統', '市集', '免費'],
    attendees: 8500,
    createdAt: '2023-11-01T09:00:00Z',
    updatedAt: '2024-02-11T18:00:00Z',
    businessIds: ['2', '6', '7', '8'],
    analytics: {
      participatingBusinesses: 4,
      totalViews: 25600,
      totalClicks: 1840,
      avgEngagement: 12.5,
      views: 25600,
      clicks: 1840,
      shares: 320,
      conversionRate: 12.5
    }
  },
  {
    id: '3',
    name: '大稻埕文創市集',
    description: '結合傳統與現代的文創市集，展示在地藝術家作品與手工藝品，體驗大稻埕的文化魅力。',
    category: '文化',
    location: '大稻埕廣場',
    address: '台北市大同區迪化街一段',
    startDate: '2024-06-15',
    endDate: '2024-06-16',
    startTime: '10:00',
    endTime: '18:00',
    status: 'published',
    organizer: '大稻埕文化基金會',
    maxAttendees: 2000,
    price: 0,
    registrationRequired: false,
    contactPhone: '02-2558-1234',
    contactEmail: 'info@dadaocheng-culture.org',
    website: 'https://dadaocheng-culture.org',
    photos: [
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&h=600&fit=crop'
    ],
    tags: ['文創', '市集', '藝術', '手工藝'],
    attendees: 850,
    createdAt: '2024-03-01T12:00:00Z',
    updatedAt: '2024-03-25T16:30:00Z',
    businessIds: ['1', '2', '4', '6', '8'],
    analytics: {
      participatingBusinesses: 5,
      totalViews: 8920,
      totalClicks: 634,
      avgEngagement: 8.4,
      views: 8920,
      clicks: 634,
      shares: 89,
      conversionRate: 8.4
    }
  },
  {
    id: '4',
    name: '台北茶文化節',
    description: '深度體驗台灣茶文化，從採茶、製茶到品茶，一次了解台灣茶的精髓。包含茶藝表演、品茶體驗和茶葉市集。',
    category: '文化',
    location: '迪化街茶行街區',
    address: '台北市大同區迪化街一段200-250號',
    startDate: '2024-05-20',
    endDate: '2024-05-21',
    startTime: '09:00',
    endTime: '17:00',
    status: 'published',
    organizer: '台北市茶商業同業公會',
    maxAttendees: 1500,
    price: 300,
    registrationRequired: true,
    contactPhone: '02-2553-7788',
    contactEmail: 'tea@taipei-tea.org.tw',
    website: 'https://taipei-tea-festival.tw',
    photos: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594631661960-17ac9952c8c8?w=800&h=600&fit=crop'
    ],
    tags: ['茶文化', '體驗', '教育', '傳統'],
    attendees: 420,
    createdAt: '2024-02-15T14:20:00Z',
    updatedAt: '2024-03-22T10:45:00Z',
    businessIds: ['2', '3', '7'],
    analytics: {
      participatingBusinesses: 3,
      totalViews: 6780,
      totalClicks: 456,
      avgEngagement: 9.1,
      views: 6780,
      clicks: 456,
      shares: 67,
      conversionRate: 9.1
    }
  },
  {
    id: '5',
    name: '大稻埕河岸音樂會',
    description: '在淡水河畔享受美妙的音樂時光，邀請知名樂團演出，搭配河景夕陽，創造難忘的音樂饗宴。',
    category: '音樂',
    location: '大稻埕碼頭河岸',
    address: '台北市大同區延平北路一段淡水河畔',
    startDate: '2024-07-13',
    endDate: '2024-07-14',
    startTime: '17:00',
    endTime: '21:00',
    status: 'draft',
    organizer: '台北市文化局',
    maxAttendees: 3000,
    price: 500,
    registrationRequired: true,
    contactPhone: '02-2720-2235',
    contactEmail: 'music@culture.gov.tw',
    website: 'https://taipei-music.gov.tw',
    photos: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop'
    ],
    tags: ['音樂', '演唱會', '河岸', '夕陽'],
    attendees: 0,
    createdAt: '2024-03-28T11:30:00Z',
    updatedAt: '2024-03-28T11:30:00Z',
    businessIds: ['1', '7', '9'],
    analytics: {
      participatingBusinesses: 3,
      totalViews: 2340,
      totalClicks: 156,
      avgEngagement: 5.2,
      views: 2340,
      clicks: 156,
      shares: 23,
      conversionRate: 5.2
    }
  }
];

export const mockTags: Tag[] = [
  { id: '1', name: '咖啡廳', category: '餐飲', isSystem: true, usageCount: 45 },
  { id: '2', name: '河景', category: '特色', isSystem: false, usageCount: 12 },
  { id: '3', name: '台式料理', category: '餐飲', isSystem: true, usageCount: 67 },
  { id: '4', name: '網美景點', category: '特色', isSystem: false, usageCount: 89 },
  { id: '5', name: '茶葉', category: '購物', isSystem: true, usageCount: 23 },
  { id: '6', name: '百年老店', category: '特色', isSystem: false, usageCount: 34 },
  { id: '7', name: '文化體驗', category: '文化', isSystem: true, usageCount: 56 },
  { id: '8', name: '廟宇', category: '景點', isSystem: true, usageCount: 78 },
  { id: '9', name: '月老', category: '特色', isSystem: false, usageCount: 12 },
  { id: '10', name: '祈福', category: '文化', isSystem: true, usageCount: 45 }
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalBusinesses: 156,
  publishedBusinesses: 123,
  pendingBusinesses: 15,
  activeEvents: 3,
  todayViews: 2340,
  todayClicks: 156,
  conversionRate: 6.7,
  topBusinesses: mockBusinesses.slice(0, 5),
  recentActivity: [
    {
      id: '1',
      action: '商家狀態更新',
      target: '大稻埕戲苑',
      user: '管理員王小明',
      timestamp: '2024-03-25T14:30:00Z',
      details: '從待審核更新為已核准'
    },
    {
      id: '2',
      action: '新增商家',
      target: '永樂市場',
      user: '管理員王小明',
      timestamp: '2024-03-25T11:30:00Z'
    },
    {
      id: '3',
      action: '活動更新',
      target: '迪化街年貨大街',
      user: '管理員王小明',
      timestamp: '2024-03-24T16:45:00Z',
      details: '更新活動描述'
    }
  ]
};

export const mockActivityLogs: ActivityLog[] = [
  ...mockDashboardMetrics.recentActivity,
  {
    id: '4',
    action: 'Excel批次上傳',
    target: '商家資料',
    user: '管理員王小明',
    timestamp: '2024-03-24T10:15:00Z',
    details: '成功上傳25筆商家資料'
  },
  {
    id: '5',
    action: '標籤管理',
    target: '新增標籤',
    user: '管理員王小明',
    timestamp: '2024-03-23T15:20:00Z',
    details: '新增"親子友善"標籤'
  }
]; 