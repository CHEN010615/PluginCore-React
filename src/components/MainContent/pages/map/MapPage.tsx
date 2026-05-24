import { useState } from 'react'
import {
  Hardware,
  LocalFireDepartment,
  AcUnit,
  Explore,
  Add,
  Remove,
  Layers,
} from '@mui/icons-material'
import styles from './index.module.scss'

interface Resource {
  id: string
  name: string
  icon: React.ReactNode
  rarity: 'common' | 'rare' | 'epic'
  rarityLabel: string
  description: string
  category: 'mineral' | 'material' | 'consumable'
}

interface MapMarker {
  id: number
  x: number
  y: number
  label: string
  resourceId: string
}

const resources: Resource[] = [
  {
    id: 'metal',
    name: '金属矿石',
    icon: <Hardware sx={{ fontSize: 20 }} />,
    rarity: 'common',
    rarityLabel: '常见',
    description: '基础金属材料，广泛分布于矿区',
    category: 'mineral',
  },
  {
    id: 'coal',
    name: '石炭',
    icon: <LocalFireDepartment sx={{ fontSize: 20 }} />,
    rarity: 'rare',
    rarityLabel: '稀有',
    description: '高能燃料材料，燃烧效率极高',
    category: 'mineral',
  },
  {
    id: 'crystal',
    name: '纯水晶',
    icon: <AcUnit sx={{ fontSize: 20 }} />,
    rarity: 'epic',
    rarityLabel: '极稀有',
    description: '纯净能量晶体，蕴含强大魔力',
    category: 'material',
  },
]

const markers: MapMarker[] = [
  { id: 1, x: 25, y: 30, label: '金属矿脉', resourceId: 'metal' },
  { id: 2, x: 60, y: 55, label: '石炭沉积', resourceId: 'coal' },
  { id: 3, x: 75, y: 25, label: '水晶洞穴', resourceId: 'crystal' },
]

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'mineral', label: '矿产' },
  { key: 'material', label: '素材' },
  { key: 'consumable', label: '消耗品' },
]

type TabKey = typeof tabs[number]['key']

const MapPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [zoom, setZoom] = useState(1)
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null)

  const filteredResources =
    activeTab === 'all'
      ? resources
      : resources.filter((r) => r.category === activeTab)

  return (
    <div className={styles.container}>
      <div className={styles.mapArea}>
        <div className={styles.mapCanvas} style={{ transform: `scale(${zoom})` }}>
          <div className={styles.mapGradient} />

          {markers.map((marker) => (
            <div
              key={marker.id}
              className={styles.marker}
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              onMouseEnter={() => setHoveredMarker(marker.id)}
              onMouseLeave={() => setHoveredMarker(null)}
            >
              <div className={`${styles.markerDot} ${styles.pulse}`} />
              <div
                className={`${styles.tooltip} ${
                  hoveredMarker === marker.id ? styles.visible : ''
                }`}
              >
                {marker.label}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.coordinates}>
          <div className={styles.compass}>
            <Explore sx={{ fontSize: 18 }} />
          </div>
          <div className={styles.coordInfo}>
            <span>X: 1247</span>
            <span>Y: 892</span>
          </div>
        </div>

        <div className={styles.zoomControls}>
          <button
            className={styles.zoomBtn}
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          >
            <Add sx={{ fontSize: 16 }} />
          </button>
          <button
            className={styles.zoomBtn}
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
          >
            <Remove sx={{ fontSize: 16 }} />
          </button>
          <button className={styles.zoomBtn}>
            <Layers sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>

      <div className={styles.resourcePanel}>
        <h3 className={styles.panelTitle}>资源指南</h3>

        <div className={styles.tabGroup}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key as TabKey)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.resourceList}>
          {filteredResources.map((resource) => (
            <div key={resource.id} className={`${styles.resourceCard} glass-panel`}>
              <div className={styles.cardIcon}>{resource.icon}</div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardName}>{resource.name}</span>
                  <span
                    className={`${styles.rarityBadge} ${
                      resource.rarity === 'common'
                        ? styles.common
                        : resource.rarity === 'rare'
                        ? styles.rare
                        : styles.epic
                    }`}
                  >
                    {resource.rarityLabel}
                  </span>
                </div>
                <p className={styles.cardDesc}>{resource.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapPage
