/**
 * 金字塔瓦片纹理管理器
 * 实现按缩放层级按需加载瓦片，分批次异步加载
 */
import * as THREE from 'three'
import {
  calculateVisibleTiles,
  loadTilesInBatches
} from './tileService'
import { getZoomLevelByDistance } from '../../utils/coordinateUtils'
import { ProvinceData } from '../../data/provinces'

interface TileData {
  x: number
  y: number
  z: number
  texture: THREE.Texture | null
  loaded: boolean
}

export class PyramidTileManager {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private texture: THREE.CanvasTexture
  private currentZoom: number = 3
  private centerLon: number = 116.4074 // 北京
  private centerLat: number = 39.9042
  private currentProvince: ProvinceData | null = null
  private tileData: Map<string, TileData> = new Map()
  private isLoading: boolean = false
  private lastUpdateTime: number = 0
  private updateDelay: number = 200 // 防抖延迟，毫秒

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = 2048
    this.canvas.height = 2048
    this.ctx = this.canvas.getContext('2d')!

    // 初始填充蓝色
    this.ctx.fillStyle = '#1a1a2e'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.texture = new THREE.CanvasTexture(this.canvas)
    // @ts-ignore 兼容不同版本Three.js类型声明
    this.texture.colorSpace = THREE.SRGBColorSpace
    this.texture.needsUpdate = true
  }

  /**
   * 获取纹理
   */
  getTexture(): THREE.CanvasTexture {
    return this.texture
  }

  /**
   * 根据相机距离更新视图
   */
  updateByCameraDistance(distance: number, lookAt: THREE.Vector3): void {
    // 计算当前合适的缩放级别
    const newZoom = getZoomLevelByDistance(distance)

    // 计算视角中心经纬度
    const [lon, lat] = this.vector3ToLonLat(lookAt)

    // 防抖：避免频繁更新
    const now = Date.now()
    if (now - this.lastUpdateTime < this.updateDelay) {
      return
    }

    // 检查是否需要更新
    const zoomChanged = Math.abs(newZoom - this.currentZoom) >= 1
    const positionChanged = Math.abs(lon - this.centerLon) > 5 || Math.abs(lat - this.centerLat) > 5

    if (zoomChanged || positionChanged) {
      this.currentZoom = newZoom
      this.centerLon = lon
      this.centerLat = lat
      this.lastUpdateTime = now
      this.updateTiles()
    }
  }

  /**
   * 3D坐标转经纬度
   */
  private vector3ToLonLat(vec: THREE.Vector3): [number, number] {
    const normalized = vec.clone().normalize()
    const lon = Math.atan2(normalized.z, normalized.x) * (180 / Math.PI)
    const lat = Math.asin(normalized.y) * (180 / Math.PI)
    return [lon, lat]
  }

  /**
   * 更新瓦片
   */
  private async updateTiles(): Promise<void> {
    if (this.isLoading) {
      return
    }

    this.isLoading = true

    try {
      // 计算视图范围内的瓦片（国家级：视图半径大一些）
      const viewRadius = this.getViewRadiusByZoom(this.currentZoom)
      const tiles = calculateVisibleTiles(this.centerLon, this.centerLat, this.currentZoom, viewRadius)

      if (tiles.length === 0) {
        this.isLoading = false
        return
      }

      // 计算画布上瓦片的排列
      const tilesPerSide = Math.ceil(Math.sqrt(tiles.length))
      const tileDisplaySize = Math.min(512, Math.floor(this.canvas.width / tilesPerSide))

      // 清空画布
      this.ctx.fillStyle = '#1a1a2e'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      // 分批次加载瓦片
      await loadTilesInBatches(
        tiles,
        4, // 每批4个
        (tile, img) => {
          if (img) {
            // 计算瓦片在画布上的位置
            const index = tiles.findIndex(t => t.x === tile.x && t.y === tile.y && t.z === tile.z)
            const row = Math.floor(index / tilesPerSide)
            const col = index % tilesPerSide

            // 绘制瓦片
            this.ctx.drawImage(
              img,
              col * tileDisplaySize,
              row * tileDisplaySize,
              tileDisplaySize,
              tileDisplaySize
            )

            this.texture.needsUpdate = true
          }
        },
        (batchIndex, loadedCount) => {
          console.log(`批次 ${batchIndex + 1} 完成，已加载 ${loadedCount} 张瓦片`)
        },
        (totalLoaded) => {
          console.log(`瓦片加载完成，共加载 ${totalLoaded} 张`)
        }
      )
    } catch (error) {
      console.error('瓦片更新失败:', error)
    } finally {
      this.isLoading = false
    }
  }

  /**
   * 设置当前省份
   */
  setProvince(province: ProvinceData): void {
    this.currentProvince = province
    this.centerLon = province.lon
    this.centerLat = province.lat
    this.currentZoom = province.zoom
    this.updateTiles()
  }

  /**
   * 获取当前省份
   */
  getCurrentProvince(): ProvinceData | null {
    return this.currentProvince
  }

  /**
   * 根据缩放级别获取视图半径
   */
  private getViewRadiusByZoom(zoom: number): number {
    // 如果有省份数据，使用省份的视图半径
    if (this.currentProvince) {
      return this.currentProvince.viewRadius
    }
    // 国家级：较低缩放级别时视图半径大，高缩放级别时视图半径小
    if (zoom <= 3) return 60
    if (zoom <= 5) return 40
    if (zoom <= 7) return 25
    if (zoom <= 10) return 15
    return 8
  }

  /**
   * 手动设置中心和缩放
   */
  setCenterAndZoom(lon: number, lat: number, zoom: number): void {
    this.centerLon = lon
    this.centerLat = lat
    this.currentZoom = zoom
    this.updateTiles()
  }

  /**
   * 获取当前缩放级别
   */
  getCurrentZoom(): number {
    return this.currentZoom
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.texture.dispose()
    this.tileData.clear()
  }
}
