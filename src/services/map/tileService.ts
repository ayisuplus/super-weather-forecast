/**
 * 卫星影像瓦片加载和缓存服务
 * 支持高德、百度地图瓦片，实现金字塔模型分批次加载
 */
import { lonLatToTile, wgs84ToGcj02 } from '../../utils/coordinateUtils'

// 瓦片缓存大小限制
const MAX_TILE_CACHE = 200

// 内存缓存
const tileCache: Map<string, HTMLImageElement> = new Map()
const tileCacheKeys: string[] = []

// IndexedDB缓存名称
const INDEXEDDB_NAME = 'SatelliteTileCache'
const INDEXEDDB_VERSION = 1
const OBJECT_STORE_NAME = 'tiles'

let db: IDBDatabase | null = null

// 瓦片服务类型
export type TileProvider = 'amap' | 'baidu'

// 瓦片配置
interface TileConfig {
  url: string
  subdomains: string[]
  maxZoom: number
  minZoom: number
  tileSize: number
  coordinateTransform: (lon: number, lat: number) => [number, number]
}

// 瓦片配置
const TILE_CONFIGS: Record<TileProvider, TileConfig> = {
  amap: {
    url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    subdomains: ['1', '2', '3', '4'],
    maxZoom: 18,
    minZoom: 1,
    tileSize: 256,
    coordinateTransform: wgs84ToGcj02
  },
  baidu: {
    url: 'https://shangetu0{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46',
    subdomains: ['1', '2', '3', '4'],
    maxZoom: 19,
    minZoom: 1,
    tileSize: 256,
    coordinateTransform: wgs84ToGcj02
  }
}

// 当前瓦片服务
let currentProvider: TileProvider = 'amap'

/**
 * 初始化IndexedDB缓存
 */
async function initDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(INDEXEDDB_NAME, INDEXEDDB_VERSION)

    request.onerror = () => reject(request.error)

    request.onsuccess = () => {
      db = request.result
      resolve()
    }

    request.onupgradeneeded = (event) => {
      const targetDb = (event.target as IDBOpenDBRequest).result
      if (!targetDb.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        targetDb.createObjectStore(OBJECT_STORE_NAME)
      }
    }
  })
}

/**
 * 从IndexedDB获取瓦片
 */
async function getTileFromDB(key: string): Promise<HTMLImageElement | null> {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([OBJECT_STORE_NAME], 'readonly')
    const store = transaction.objectStore(OBJECT_STORE_NAME)
    const request = store.get(key)

    request.onsuccess = () => {
      if (request.result) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
        img.src = request.result
      } else {
        resolve(null)
      }
    }

    request.onerror = () => reject(request.error)
  })
}

/**
 * 保存瓦片到IndexedDB
 */
async function saveTileToDB(key: string, dataUrl: string): Promise<void> {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([OBJECT_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(OBJECT_STORE_NAME)
    const request = store.put(dataUrl, key)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * 生成瓦片缓存键
 */
function getTileKey(x: number, y: number, z: number, provider: TileProvider): string {
  return `${provider}_${z}_${x}_${y}`
}

/**
 * 生成瓦片URL
 */
function getTileUrl(x: number, y: number, z: number, provider: TileProvider): string {
  const config = TILE_CONFIGS[provider]
  const subdomain = config.subdomains[Math.floor(Math.random() * config.subdomains.length)]
  return config.url
    .replace('{x}', x.toString())
    .replace('{y}', y.toString())
    .replace('{z}', z.toString())
    .replace('{s}', subdomain)
}

/**
 * 加载单个瓦片
 */
async function loadTile(x: number, y: number, z: number, provider: TileProvider = currentProvider): Promise<HTMLImageElement | null> {
  const key = getTileKey(x, y, z, provider)

  // 先检查内存缓存
  if (tileCache.has(key)) {
    return tileCache.get(key)!
  }

  // 再检查IndexedDB缓存
  const cachedTile = await getTileFromDB(key)
  if (cachedTile) {
    // 添加到内存缓存
    addToMemoryCache(key, cachedTile)
    return cachedTile
  }

  // 从网络加载
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      // 保存到内存缓存
      addToMemoryCache(key, img)

      // 保存到IndexedDB
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        saveTileToDB(key, canvas.toDataURL('image/png')).catch(() => {})
      }

      resolve(img)
    }

    img.onerror = () => {
      resolve(null)
    }

    img.src = getTileUrl(x, y, z, provider)
  })
}

/**
 * 添加到内存缓存
 */
function addToMemoryCache(key: string, img: HTMLImageElement): void {
  // 如果缓存已满，移除最早的
  if (tileCache.size >= MAX_TILE_CACHE) {
    const oldestKey = tileCacheKeys.shift()
    if (oldestKey) {
      tileCache.delete(oldestKey)
    }
  }

  tileCache.set(key, img)
  tileCacheKeys.push(key)
}

/**
 * 设置当前瓦片服务
 */
export function setTileProvider(provider: TileProvider): void {
  currentProvider = provider
}

/**
 * 获取当前瓦片服务
 */
export function getTileProvider(): TileProvider {
  return currentProvider
}

/**
 * 瓦片信息接口
 */
export interface TileInfo {
  x: number
  y: number
  z: number
}

/**
 * 计算视图范围内的瓦片
 * @param centerLon 中心经度
 * @param centerLat 中心纬度
 * @param zoom 缩放级别
 * @param viewRadius 视图半径（度）
 * @returns 瓦片列表
 */
export function calculateVisibleTiles(
  centerLon: number,
  centerLat: number,
  zoom: number,
  viewRadius: number = 30
): TileInfo[] {
  const tiles: TileInfo[] = []
  const config = TILE_CONFIGS[currentProvider]

  // 限制缩放级别
  const validZoom = Math.max(config.minZoom, Math.min(config.maxZoom, zoom))

  // 计算视图范围
  const minLon = centerLon - viewRadius
  const maxLon = centerLon + viewRadius
  const minLat = centerLat - viewRadius
  const maxLat = centerLat + viewRadius

  // 转换为瓦片坐标
  const [minX, minY] = lonLatToTile(minLon, maxLat, validZoom)
  const [maxX, maxY] = lonLatToTile(maxLon, minLat, validZoom)

  // 生成瓦片列表
  for (let x = Math.floor(minX); x <= Math.floor(maxX); x++) {
    for (let y = Math.floor(minY); y <= Math.floor(maxY); y++) {
      // 验证瓦片坐标是否有效
      const maxTile = Math.pow(2, validZoom) - 1
      if (x >= 0 && x <= maxTile && y >= 0 && y <= maxTile) {
        tiles.push({ x, y, z: validZoom })
      }
    }
  }

  return tiles
}

/**
 * 分批次加载瓦片
 * @param tiles 瓦片列表
 * @param batchSize 每批加载数量
 * @param onTileLoaded 每个瓦片加载完成回调
 * @param onBatchComplete 每批加载完成回调
 * @param onAllComplete 全部加载完成回调
 */
export async function loadTilesInBatches(
  tiles: TileInfo[],
  batchSize: number = 4,
  onTileLoaded?: (tile: TileInfo, img: HTMLImageElement | null) => void,
  onBatchComplete?: (batchIndex: number, loadedCount: number) => void,
  onAllComplete?: (totalLoaded: number) => void
): Promise<void> {
  let totalLoaded = 0

  for (let i = 0; i < tiles.length; i += batchSize) {
    const batch = tiles.slice(i, i + batchSize)
    const batchPromises = batch.map(tile => loadTile(tile.x, tile.y, tile.z))

    const results = await Promise.all(batchPromises)

    results.forEach((img, index) => {
      if (onTileLoaded) {
        onTileLoaded(batch[index], img)
      }
      if (img) {
        totalLoaded++
      }
    })

    if (onBatchComplete) {
      onBatchComplete(Math.floor(i / batchSize), totalLoaded)
    }
  }

  if (onAllComplete) {
    onAllComplete(totalLoaded)
  }
}

/**
 * 获取瓦片配置
 */
export function getTileConfig(): TileConfig {
  return TILE_CONFIGS[currentProvider]
}

/**
 * 清除内存缓存
 */
export function clearMemoryCache(): void {
  tileCache.clear()
  tileCacheKeys.length = 0
}

/**
 * 获取缓存状态
 */
export function getCacheStatus(): { memory: number; max: number } {
  return {
    memory: tileCache.size,
    max: MAX_TILE_CACHE
  }
}

/**
 * 预加载指定区域的瓦片
 */
export async function preloadTiles(
  centerLon: number,
  centerLat: number,
  zoomLevels: number[]
): Promise<void> {
  const tiles: TileInfo[] = []
  for (const zoom of zoomLevels) {
    const viewRadius = getViewRadiusForZoom(zoom)
    const zoomTiles = calculateVisibleTiles(centerLon, centerLat, zoom, viewRadius)
    tiles.push(...zoomTiles)
  }
  await loadTilesInBatches(tiles, 4)
}

/**
 * 根据缩放级别获取合适的视图半径
 */
export function getViewRadiusForZoom(zoom: number): number {
  if (zoom <= 3) return 60
  if (zoom <= 5) return 40
  if (zoom <= 7) return 25
  if (zoom <= 10) return 15
  if (zoom <= 12) return 8
  if (zoom <= 14) return 4
  if (zoom <= 16) return 2
  return 1
}
