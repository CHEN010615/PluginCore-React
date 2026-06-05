import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Add,
  Close,
  Diamond,
  Egg,
  ExpandLess,
  ExpandMore,
  Map as MapIcon,
  Place,
  PrecisionManufacturing,
  Psychology,
  Remove,
  Search,
  SportsMartialArts,
  Star,
  Water,
} from '@mui/icons-material'
import styles from './index.module.scss'
import {
  MAP_MAX_TILE_ZOOM,
  MAP_MAX_TILE_SCALE,
  MAP_MIN_TILE_ZOOM,
  MAP_TILE_SIZE,
  getMapTileUrl,
  mapMarkerIconUrls,
  type MapMarkerIconKey,
} from './mapAssets'

interface MarkerType {
  key: MapMarkerIconKey
  label: string
}

interface CategoryGroup {
  key: string
  label: string
  color: string
  icon: React.ReactNode
  types: MarkerType[]
}

interface MarkerData {
  id: string
  name: string
  nameEn: string
  type: MapMarkerIconKey
  x: number
  y: number
  description: string
  level?: string
  spawnTime?: 'day' | 'night' | 'both'
}

interface ViewportState {
  zoom: number
  offsetX: number
  offsetY: number
}

interface TileData {
  key: string
  url: string
  left: number
  top: number
  size: number
}

const BASE_TILE_ZOOM = 1
const BASE_TILE_COUNT = 2 ** BASE_TILE_ZOOM
const WORLD_SIZE = MAP_TILE_SIZE * BASE_TILE_COUNT
const MIN_ZOOM = 0.75
const MAX_ZOOM = 8
const WHEEL_ZOOM_STEP = 1.18
const DEFAULT_SELECTED_TYPES: MapMarkerIconKey[] = ['alphaPal', 'enemyBase', 'fastTravel', 'dungeon']

const markerTypes: Record<MapMarkerIconKey, MarkerType> = {
  alphaPal: { key: 'alphaPal', label: '头目帕鲁' },
  enemyBase: { key: 'enemyBase', label: '敌人基地' },
  rampage: { key: 'rampage', label: '狂暴帕鲁' },
  bounty: { key: 'bounty', label: '悬赏目标' },
  tower: { key: 'tower', label: '高塔' },
  cave: { key: 'cave', label: '洞穴入口' },
  event: { key: 'event', label: '事件' },
  bondFruit: { key: 'bondFruit', label: '羁绊宝桃' },
  nightstarSand: { key: 'nightstarSand', label: '夜星砂' },
  skillTree: { key: 'skillTree', label: '技能树' },
  crudeOil: { key: 'crudeOil', label: '原油' },
  junk: { key: 'junk', label: '杂物' },
  elementalChest: { key: 'elementalChest', label: '元素宝箱' },
  treasure: { key: 'treasure', label: '宝箱' },
  beautifulFlower: { key: 'beautifulFlower', label: '美丽花朵' },
  supply: { key: 'supply', label: '空投' },
  heatSource: { key: 'heatSource', label: '热源' },
  treasureMap: { key: 'treasureMap', label: '藏宝图' },
  antiAir: { key: 'antiAir', label: '防空炮台' },
  fastTravel: { key: 'fastTravel', label: '快速传送' },
  dungeon: { key: 'dungeon', label: '地下城' },
  home: { key: 'home', label: '建议建家点' },
  respawn: { key: 'respawn', label: '复活点' },
  region: { key: 'region', label: '区域标签' },
  fishing: { key: 'fishing', label: '钓鱼点' },
  salvage1: { key: 'salvage1', label: '打捞点 等级1' },
  salvage2: { key: 'salvage2', label: '打捞点 等级2' },
  fairyEgg: { key: 'fairyEgg', label: '妖精蛋' },
  grassEgg: { key: 'grassEgg', label: '草原蛋' },
  volcanoEgg: { key: 'volcanoEgg', label: '火山蛋' },
  frozenEgg: { key: 'frozenEgg', label: '冰霜蛋' },
  desertEgg: { key: 'desertEgg', label: '沙漠蛋' },
  sakuraEgg: { key: 'sakuraEgg', label: '樱花蛋' },
  chromite: { key: 'chromite', label: '铬铁矿' },
  hexolite: { key: 'hexolite', label: '六棱晶矿' },
  pureQuartz: { key: 'pureQuartz', label: '纯水晶' },
  pureQuartzCluster: { key: 'pureQuartzCluster', label: '纯水晶矿簇' },
  sulfur: { key: 'sulfur', label: '硫磺' },
  sulfurCluster: { key: 'sulfurCluster', label: '硫磺矿簇' },
  ore: { key: 'ore', label: '金属矿石' },
  oreCluster: { key: 'oreCluster', label: '金属矿簇' },
  coal: { key: 'coal', label: '石炭' },
  coalCluster: { key: 'coalCluster', label: '石炭矿簇' },
  wanderingMerchant: { key: 'wanderingMerchant', label: '流浪商人' },
  blackMarketeer: { key: 'blackMarketeer', label: '黑市商人' },
  npc: { key: 'npc', label: 'NPC' },
  palCritic: { key: 'palCritic', label: '自大的帕鲁评赏家' },
  lifmunkEffigy: { key: 'lifmunkEffigy', label: '翠叶鼠雕像' },
  journal: { key: 'journal', label: '手记' },
  graffitiInk: { key: 'graffitiInk', label: '涂鸦墨水' },
  unknown: { key: 'unknown', label: '未知' },
  torch: { key: 'torch', label: '火把' },
  test: { key: 'test', label: '测试' },
  oilrigTreasure: { key: 'oilrigTreasure', label: '油田宝箱' },
  oilrigBigTreasure: { key: 'oilrigBigTreasure', label: '油田大宝箱' },
}

const categoryGroups: CategoryGroup[] = [
  {
    key: 'enemies',
    label: '敌人',
    color: '#f87171',
    icon: <SportsMartialArts sx={{ fontSize: 18 }} />,
    types: [markerTypes.alphaPal, markerTypes.enemyBase, markerTypes.rampage, markerTypes.bounty, markerTypes.tower, markerTypes.cave, markerTypes.event],
  },
  {
    key: 'resources',
    label: '资源',
    color: '#fbbf24',
    icon: <Diamond sx={{ fontSize: 18 }} />,
    types: [
      markerTypes.bondFruit,
      markerTypes.nightstarSand,
      markerTypes.skillTree,
      markerTypes.crudeOil,
      markerTypes.junk,
      markerTypes.elementalChest,
      markerTypes.treasure,
      markerTypes.beautifulFlower,
      markerTypes.supply,
    ],
  },
  {
    key: 'locations',
    label: '地点',
    color: '#60a5fa',
    icon: <Place sx={{ fontSize: 18 }} />,
    types: [markerTypes.heatSource, markerTypes.treasureMap, markerTypes.antiAir, markerTypes.fastTravel, markerTypes.dungeon, markerTypes.home, markerTypes.respawn, markerTypes.region],
  },
  {
    key: 'fishing',
    label: '钓鱼',
    color: '#38bdf8',
    icon: <Water sx={{ fontSize: 18 }} />,
    types: [markerTypes.fishing, markerTypes.salvage1, markerTypes.salvage2],
  },
  {
    key: 'eggs',
    label: '帕鲁蛋',
    color: '#fb923c',
    icon: <Egg sx={{ fontSize: 18 }} />,
    types: [markerTypes.fairyEgg, markerTypes.grassEgg, markerTypes.volcanoEgg, markerTypes.frozenEgg, markerTypes.desertEgg, markerTypes.sakuraEgg],
  },
  {
    key: 'minerals',
    label: '矿石',
    color: '#facc15',
    icon: <Diamond sx={{ fontSize: 18 }} />,
    types: [
      markerTypes.chromite,
      markerTypes.hexolite,
      markerTypes.pureQuartz,
      markerTypes.pureQuartzCluster,
      markerTypes.sulfur,
      markerTypes.sulfurCluster,
      markerTypes.ore,
      markerTypes.oreCluster,
      markerTypes.coal,
      markerTypes.coalCluster,
    ],
  },
  {
    key: 'npcs',
    label: 'NPC',
    color: '#a78bfa',
    icon: <Psychology sx={{ fontSize: 18 }} />,
    types: [markerTypes.wanderingMerchant, markerTypes.blackMarketeer, markerTypes.npc, markerTypes.palCritic],
  },
  {
    key: 'collectibles',
    label: '收集品',
    color: '#34d399',
    icon: <Star sx={{ fontSize: 18 }} />,
    types: [markerTypes.lifmunkEffigy, markerTypes.journal],
  },
  {
    key: 'other',
    label: '其他',
    color: '#94a3b8',
    icon: <Star sx={{ fontSize: 18 }} />,
    types: [markerTypes.graffitiInk, markerTypes.unknown, markerTypes.torch, markerTypes.test],
  },
  {
    key: 'oilrig',
    label: '石油平台',
    color: '#f472b6',
    icon: <PrecisionManufacturing sx={{ fontSize: 18 }} />,
    types: [markerTypes.oilrigTreasure, markerTypes.oilrigBigTreasure],
  },
]

const markers: MarkerData[] = [
  {
    id: 'fast-travel-01',
    name: '湿地之岛的教堂遗址',
    nameEn: 'Marsh Island Church Ruins',
    type: 'fastTravel',
    x: 63,
    y: 42,
    description: '参考站点默认展示的快速传送类图层点位。',
  },
  {
    id: 'fast-travel-02',
    name: '小型聚落',
    nameEn: 'Small Settlement',
    type: 'fastTravel',
    x: 58,
    y: 46,
    description: '早期常用传送点，适合资源路线规划。',
  },
  {
    id: 'dungeon-01',
    name: '石柱洞窟',
    nameEn: 'Stone Pillar Cave',
    type: 'dungeon',
    x: 44,
    y: 62,
    level: 'Lv.20-25',
    description: '地下城入口示例点位。',
  },
  {
    id: 'boss-jetdragon',
    name: '空涡龙',
    nameEn: 'Jetragon',
    type: 'alphaPal',
    x: 83,
    y: 18,
    level: 'Lv.50',
    spawnTime: 'both',
    description: '火山区域的传说级头目帕鲁，适合后期挑战。',
  },
  {
    id: 'enemy-base-01',
    name: '盗猎团的勘探油田',
    nameEn: 'Syndicate Oil Field',
    type: 'enemyBase',
    x: 70,
    y: 55,
    level: 'Lv.30',
    description: '敌人基地示例点位。',
  },
  {
    id: 'ore-01',
    name: '金属矿簇',
    nameEn: 'Ore Cluster',
    type: 'oreCluster',
    x: 39,
    y: 35,
    description: '多个金属矿石密集分布，适合建立早期采矿据点。',
  },
  {
    id: 'coal-01',
    name: '石炭',
    nameEn: 'Coal',
    type: 'coal',
    x: 71,
    y: 63,
    description: '火山周边常见燃料资源点。',
  },
  {
    id: 'oil-01',
    name: '原油',
    nameEn: 'Crude Oil',
    type: 'crudeOil',
    x: 88,
    y: 51,
    description: '后期生产链的重要资源点。',
  },
  {
    id: 'merchant-01',
    name: '流浪商人',
    nameEn: 'Wandering Merchant',
    type: 'wanderingMerchant',
    x: 48,
    y: 42,
    description: '出售基础物资，商品会随区域变化。',
  },
  {
    id: 'lifmunk-01',
    name: '翠叶鼠雕像',
    nameEn: 'Lifmunk Effigy',
    type: 'lifmunkEffigy',
    x: 60,
    y: 38,
    description: '收集后可提升捕获力等级。',
  },
]

const allTypeKeys = Object.keys(markerTypes) as MapMarkerIconKey[]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getSpawnTimeLabel(spawnTime: MarkerData['spawnTime']) {
  if (spawnTime === 'day') return '仅白天刷新'
  if (spawnTime === 'night') return '仅夜晚刷新'
  if (spawnTime === 'both') return '全天刷新'
  return ''
}

function getTileZoom(zoom: number) {
  const tileScale = Math.min(zoom, MAP_MAX_TILE_SCALE)
  return clamp(Math.floor(tileScale), MAP_MIN_TILE_ZOOM, MAP_MAX_TILE_ZOOM)
}

function createTiles(tileZoom: number): TileData[] {
  const tileCount = 2 ** tileZoom
  const tileSize = WORLD_SIZE / tileCount
  const tiles: TileData[] = []

  for (let y = 0; y < tileCount; y += 1) {
    for (let x = 0; x < tileCount; x += 1) {
      tiles.push({
        key: `${tileZoom}-${x}-${y}`,
        url: getMapTileUrl(tileZoom, x, y),
        left: x * tileSize,
        top: y * tileSize,
        size: tileSize,
      })
    }
  }

  return tiles
}

const loadedTileZooms = new Set<number>()

function preloadTiles(tiles: TileData[]) {
  return Promise.all(
    tiles.map((tile) => new Promise<void>((resolve) => {
      const image = new Image()
      image.onload = () => resolve()
      image.onerror = () => resolve()
      image.src = tile.url
    })),
  )
}

const MapPage = () => {
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<Set<MapMarkerIconKey>>(() => new Set(DEFAULT_SELECTED_TYPES))
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(categoryGroups.map((group) => group.key)))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
  const [viewport, setViewport] = useState<ViewportState>({ zoom: 1, offsetX: 0, offsetY: 0 })
  const [activeTileZoom, setActiveTileZoom] = useState(() => getTileZoom(1))
  const [isPanning, setIsPanning] = useState(false)

  useLayoutEffect(() => {
    const rect = viewportRef.current?.getBoundingClientRect()
    if (!rect) return

    setViewport((current) => ({
      ...current,
      offsetX: (rect.width - WORLD_SIZE * current.zoom) / 2,
      offsetY: (rect.height - WORLD_SIZE * current.zoom) / 2,
    }))
  }, [])

  const requestedTileZoom = getTileZoom(viewport.zoom)
  const tiles = useMemo(() => createTiles(activeTileZoom), [activeTileZoom])

  useEffect(() => {
    if (requestedTileZoom === activeTileZoom) return

    let cancelled = false
    const nextTiles = createTiles(requestedTileZoom)

    if (loadedTileZooms.has(requestedTileZoom)) {
      setActiveTileZoom(requestedTileZoom)
      return
    }

    preloadTiles(nextTiles).then(() => {
      loadedTileZooms.add(requestedTileZoom)
      if (!cancelled) {
        setActiveTileZoom(requestedTileZoom)
      }
    })

    return () => {
      cancelled = true
    }
  }, [activeTileZoom, requestedTileZoom])

  const filteredMarkers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (keyword) {
      return markers.filter((marker) => {
        const typeLabel = markerTypes[marker.type].label
        return (
          marker.name.toLowerCase().includes(keyword)
          || marker.nameEn.toLowerCase().includes(keyword)
          || typeLabel.toLowerCase().includes(keyword)
        )
      })
    }

    return markers.filter((marker) => selectedTypes.has(marker.type))
  }, [searchTerm, selectedTypes])

  const filteredGroups = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return categoryGroups

    return categoryGroups
      .map((group) => ({
        ...group,
        types: group.types.filter((type) => {
          return (
            type.label.toLowerCase().includes(keyword)
            || markers.some((marker) => marker.type === type.key && (
              marker.name.toLowerCase().includes(keyword)
              || marker.nameEn.toLowerCase().includes(keyword)
            ))
          )
        }),
      }))
      .filter((group) => group.types.length > 0)
  }, [searchTerm])

  const setZoomAroundPoint = (nextZoom: number, pointX: number, pointY: number) => {
    setViewport((current) => {
      const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM)
      const mapX = (pointX - current.offsetX) / current.zoom
      const mapY = (pointY - current.offsetY) / current.zoom

      return {
        zoom,
        offsetX: pointX - mapX * zoom,
        offsetY: pointY - mapY * zoom,
      }
    })
  }

  const focusMarker = (marker: MarkerData) => {
    const rect = viewportRef.current?.getBoundingClientRect()
    if (!rect) return

    setSelectedMarkerId(marker.id)
    setViewport((current) => ({
      ...current,
      offsetX: rect.width / 2 - (marker.x / 100) * WORLD_SIZE * current.zoom,
      offsetY: rect.height / 2 - (marker.y / 100) * WORLD_SIZE * current.zoom,
    }))
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()

    const rect = viewportRef.current?.getBoundingClientRect()
    if (!rect) return

    const pointX = event.clientX - rect.left
    const pointY = event.clientY - rect.top
    const zoomFactor = event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP

    setZoomAroundPoint(viewport.zoom * zoomFactor, pointX, pointY)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return

    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      offsetX: viewport.offsetX,
      offsetY: viewport.offsetY,
    }
    setIsPanning(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return

    const deltaX = event.clientX - dragRef.current.startX
    const deltaY = event.clientY - dragRef.current.startY

    setViewport((current) => ({
      ...current,
      offsetX: dragRef.current ? dragRef.current.offsetX + deltaX : current.offsetX,
      offsetY: dragRef.current ? dragRef.current.offsetY + deltaY : current.offsetY,
    }))
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return

    event.currentTarget.releasePointerCapture(event.pointerId)
    dragRef.current = null
    setIsPanning(false)
  }

  const changeZoomFromCenter = (zoomFactor: number) => {
    const rect = viewportRef.current?.getBoundingClientRect()
    if (!rect) return

    setZoomAroundPoint(viewport.zoom * zoomFactor, rect.width / 2, rect.height / 2)
  }

  const toggleType = (typeKey: MapMarkerIconKey) => {
    setSelectedTypes((current) => {
      const next = new Set(current)
      next.has(typeKey) ? next.delete(typeKey) : next.add(typeKey)
      return next
    })
  }

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((current) => {
      const next = new Set(current)
      next.has(groupKey) ? next.delete(groupKey) : next.add(groupKey)
      return next
    })
  }

  const setGroupTypes = (group: CategoryGroup, selected: boolean) => {
    setSelectedTypes((current) => {
      const next = new Set(current)
      group.types.forEach((type) => {
        selected ? next.add(type.key) : next.delete(type.key)
      })
      return next
    })
  }

  return (
    <div className={styles.container}>
      <aside className={styles.layerPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>
            <MapIcon sx={{ fontSize: 20 }} />
            图层筛选
          </h2>
          <span className={styles.countBadge}>
            {selectedTypes.size}/{allTypeKeys.length}
          </span>
        </div>

        <div className={styles.searchBox}>
          <Search sx={{ fontSize: 18 }} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className={styles.searchInput}
            placeholder="搜索图层或标记..."
          />
          {searchTerm && (
            <button className={styles.clearSearch} onClick={() => setSearchTerm('')}>
              <Close sx={{ fontSize: 16 }} />
            </button>
          )}
        </div>

        {!searchTerm && (
          <div className={styles.batchActions}>
            <button className={styles.batchBtn} onClick={() => setSelectedTypes(new Set(allTypeKeys))}>
              全选
            </button>
            <button className={styles.batchBtn} onClick={() => setSelectedTypes(new Set())}>
              清空
            </button>
          </div>
        )}

        <div className={styles.groupsList}>
          {filteredGroups.map((group) => {
            const selectedCount = group.types.filter((type) => selectedTypes.has(type.key)).length
            const expanded = expandedGroups.has(group.key)

            return (
              <section key={group.key} className={styles.group}>
                <button className={styles.groupHeader} onClick={() => toggleGroup(group.key)}>
                  <span className={styles.groupTitle}>
                    {expanded ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                    <span className={styles.groupIcon} style={{ color: group.color }}>{group.icon}</span>
                    <span>{group.label}</span>
                    <span className={styles.groupCount}>({selectedCount}/{group.types.length})</span>
                  </span>
                  <span className={styles.groupActions}>
                    <span onClick={(event) => { event.stopPropagation(); setGroupTypes(group, true) }}>全选</span>
                    <span onClick={(event) => { event.stopPropagation(); setGroupTypes(group, false) }}>清空</span>
                  </span>
                </button>

                {expanded && (
                  <div className={styles.typeList}>
                    {group.types.map((type) => (
                      <label key={type.key} className={styles.typeItem}>
                        <input
                          type="checkbox"
                          checked={selectedTypes.has(type.key)}
                          onChange={() => toggleType(type.key)}
                        />
                        <img className={styles.typeIcon} src={mapMarkerIconUrls[type.key]} alt="" draggable={false} />
                        <span>{type.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </aside>

      <section className={styles.mapArea}>
        <div
          ref={viewportRef}
          className={`${styles.mapViewport} ${isPanning ? styles.mapViewportPanning : ''}`}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className={styles.mapSurface}
            style={{
              width: WORLD_SIZE,
              height: WORLD_SIZE,
              transform: `translate3d(${viewport.offsetX}px, ${viewport.offsetY}px, 0) scale(${viewport.zoom})`,
            }}
          >
            <div className={styles.tileLayer}>
              {tiles.map((tile) => (
                <img
                  key={tile.key}
                  className={styles.mapTile}
                  src={tile.url}
                  alt=""
                  draggable={false}
                  style={{
                    left: tile.left,
                    top: tile.top,
                    width: tile.size,
                    height: tile.size,
                  }}
                />
              ))}
            </div>

            {filteredMarkers.map((marker) => {
              const selected = marker.id === selectedMarkerId
              const markerSize = (selected ? 44 : 34) / viewport.zoom

              return (
                <button
                  key={marker.id}
                  className={`${styles.marker} ${selected ? styles.markerSelected : ''}`}
                  style={{
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    width: markerSize,
                    height: markerSize,
                  }}
                  onClick={() => {
                    setSelectedMarkerId(marker.id)
                  }}
                >
                  <img src={mapMarkerIconUrls[marker.type]} alt={marker.name} draggable={false} />
                  <span className={styles.markerTooltip}>
                    <strong>{marker.name}</strong>
                    <small>{markerTypes[marker.type].label}</small>
                  </span>
                </button>
              )
            })}
          </div>

          <div className={styles.zoomControls}>
            <button onClick={() => changeZoomFromCenter(WHEEL_ZOOM_STEP)} title="放大">
              <Add sx={{ fontSize: 16 }} />
            </button>
            <button onClick={() => changeZoomFromCenter(1 / WHEEL_ZOOM_STEP)} title="缩小">
              <Remove sx={{ fontSize: 16 }} />
            </button>
            <span>{Math.round(viewport.zoom * 100)}%</span>
          </div>
        </div>

        {selectedMarkerId && (
          <aside className={styles.detailPanel}>
            {markers
              .filter((marker) => marker.id === selectedMarkerId)
              .map((marker) => (
                <div key={marker.id} className={styles.detailInner}>
                  <button className={styles.detailClose} onClick={() => setSelectedMarkerId(null)}>
                    <Close sx={{ fontSize: 16 }} />
                  </button>
                  <div className={styles.detailHeader}>
                    <img src={mapMarkerIconUrls[marker.type]} alt={marker.name} draggable={false} />
                    <div>
                      <h3>{marker.name}</h3>
                      <span>{marker.nameEn}</span>
                    </div>
                  </div>
                  <div className={styles.detailMeta}>
                    <span>{markerTypes[marker.type].label}</span>
                    {marker.level && <span>{marker.level}</span>}
                    {marker.spawnTime && <span>{getSpawnTimeLabel(marker.spawnTime)}</span>}
                  </div>
                  <p>{marker.description}</p>
                  <small>坐标: {Math.round(marker.x)}%, {Math.round(marker.y)}%</small>
                </div>
              ))}
          </aside>
        )}

        {searchTerm && (
          <div className={styles.searchResults}>
            <div className={styles.searchResultsHeader}>找到 {filteredMarkers.length} 个结果</div>
            <div className={styles.searchResultsList}>
              {filteredMarkers.slice(0, 8).map((marker) => (
                <button
                  key={marker.id}
                  className={styles.searchResult}
                  onClick={() => focusMarker(marker)}
                >
                  <img src={mapMarkerIconUrls[marker.type]} alt="" draggable={false} />
                  <span>
                    <strong>{marker.name}</strong>
                    <small>{markerTypes[marker.type].label}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default MapPage
