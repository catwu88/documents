import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 修復 Leaflet 預設圖標問題
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Business {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  category: string;
  analytics?: {
    views: number;
    clickThroughRate: number;
  };
}

interface OpenStreetMapProps {
  businesses: Business[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  onBusinessClick?: (business: Business) => void;
  showLegend?: boolean;
  selectedCategories?: string[];
}

// 自定義商家圖標 - 簡潔的純色圓點設計
const createBusinessIcon = (category: string, isTopPerformer: boolean = false, isHighlighted: boolean = false) => {
  const baseColor = getCategoryColor(category);
  const color = isTopPerformer ? '#ff4d4f' : baseColor;
  const size = isHighlighted ? 20 : 16;
  const borderWidth = isHighlighted ? 3 : 2;
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: ${borderWidth}px solid white;
        box-shadow: 0 ${isHighlighted ? 3 : 2}px ${isHighlighted ? 8 : 6}px rgba(0,0,0,${isHighlighted ? 0.4 : 0.3});
        transform: ${isHighlighted ? 'scale(1.1)' : 'scale(1)'};
        transition: all 0.2s ease;
        cursor: pointer;
      ">
      </div>
    `,
    className: 'custom-business-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    '餐飲': '#1890ff',
    '購物': '#52c41a',
    '景點': '#faad14',
    '文化': '#722ed1',
    '其他': '#8c8c8c',
  };
  return colors[category] || colors['其他'];
};

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  businesses,
  center = [25.0330, 121.5654], // 台北市中心
  zoom = 13,
  height = 400,
  onBusinessClick,
  showLegend = true,
  selectedCategories
}) => {
  // 計算表現最佳的商家
  const topPerformers = businesses
    .filter(b => b.analytics)
    .sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0))
    .slice(0, 3)
    .map(b => b.id);

  return (
    <div style={{ height, width: '100%', borderRadius: 8, overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap 圖層 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 商家標記 */}
        {businesses.map((business) => {
          if (!business.latitude || !business.longitude) return null;
          
          const isTopPerformer = topPerformers.includes(business.id);
          const isHighlighted = selectedCategories?.includes(business.category);
          
          return (
            <Marker
              key={business.id}
              position={[business.latitude, business.longitude]}
              icon={createBusinessIcon(business.category, isTopPerformer, isHighlighted)}
              eventHandlers={{
                click: () => onBusinessClick?.(business),
              }}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 14 }}>
                    {business.name}
                  </div>
                  <div style={{ color: '#666', marginBottom: 4, fontSize: 12 }}>
                    📍 {business.address}
                  </div>
                  <div style={{ color: '#666', marginBottom: 8, fontSize: 12 }}>
                    🏷️ {business.category}
                  </div>
                  
                  {business.analytics && (
                    <div style={{ 
                      background: '#f5f5f5', 
                      padding: 8, 
                      borderRadius: 4,
                      fontSize: 12
                    }}>
                      <div style={{ marginBottom: 4 }}>
                        👁️ 瀏覽量: <strong>{business.analytics.views.toLocaleString()}</strong>
                      </div>
                      <div>
                        📊 點擊率: <strong>{business.analytics.clickThroughRate.toFixed(1)}%</strong>
                      </div>
                    </div>
                  )}
                  
                  {isTopPerformer && (
                    <div style={{ 
                      background: '#fff2e8', 
                      color: '#fa8c16',
                      padding: 4,
                      borderRadius: 4,
                      textAlign: 'center',
                      marginTop: 8,
                      fontSize: 11,
                      fontWeight: 'bold'
                    }}>
                      🏆 熱門商家
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* 圖例 */}
      {showLegend && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'white',
          padding: 12,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: 12,
          zIndex: 1000,
          minWidth: 120
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>圖例</div>
          
          {/* 商家統計 */}
          <div style={{ 
            background: '#f5f5f5', 
            padding: 8, 
            borderRadius: 4, 
            marginBottom: 8,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
              {businesses.length}
            </div>
            <div style={{ fontSize: 10, color: '#666' }}>顯示商家</div>
          </div>

          {/* 分類圖例 */}
          {['餐飲', '購物', '景點', '文化'].map(category => {
            const categoryBusinesses = businesses.filter(b => b.category === category);
            const isSelected = selectedCategories?.includes(category);
            
            if (categoryBusinesses.length === 0) return null;
            
            return (
              <div key={category} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: 4,
                opacity: isSelected === false ? 0.5 : 1
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: getCategoryColor(category),
                  marginRight: 6,
                  border: isSelected ? '2px solid #333' : 'none'
                }}></div>
                <span style={{ fontSize: 11 }}>
                  {category} ({categoryBusinesses.length})
                </span>
              </div>
            );
          })}
          
          {/* 熱門商家圖例 */}
          {topPerformers.length > 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginTop: 8,
              paddingTop: 8,
              borderTop: '1px solid #f0f0f0'
            }}>
              <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#ff4d4f',
                marginRight: 6
              }}></div>
              <span style={{ fontSize: 11 }}>熱門商家</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpenStreetMap; 