/**
 * 坐标转换工具类
 * 实现WGS84、GCJ02坐标互转，经纬度转瓦片坐标等功能
 */

// 地球半径
const EARTH_RADIUS = 6378137.0
const PI = Math.PI

/**
 * 判断是否在中国境内
 * @param lon 经度
 * @param lat 纬度
 * @returns 是否在中国境内
 */
function isInChina(lon: number, lat: number): boolean {
  return lon >= 72.004 && lon <= 137.8347 && lat >= 0.8293 && lat <= 55.8271
}

/**
 * WGS-84转GCJ-02（火星坐标）
 * @param wgsLon WGS-84经度
 * @param wgsLat WGS-84纬度
 * @returns GCJ-02坐标 [lon, lat]
 */
export function wgs84ToGcj02(wgsLon: number, wgsLat: number): [number, number] {
  // 国外坐标不需要偏移
  if (!isInChina(wgsLon, wgsLat)) {
    return [wgsLon, wgsLat]
  }

  let dLat = transformLat(wgsLon - 105.0, wgsLat - 35.0)
  let dLon = transformLon(wgsLon - 105.0, wgsLat - 35.0)
  const radLat = wgsLat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - 0.00669342162296594629 * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((EARTH_RADIUS * (1 - 0.00669342162296594629)) / (magic * sqrtMagic) * PI)
  dLon = (dLon * 180.0) / (EARTH_RADIUS / sqrtMagic * Math.cos(radLat) * PI)
  const mgLat = wgsLat + dLat
  const mgLon = wgsLon + dLon
  return [mgLon, mgLat]
}

/**
 * GCJ-02转WGS-84
 * @param gcjLon GCJ-02经度
 * @param gcjLat GCJ-02纬度
 * @returns WGS-84坐标 [lon, lat]
 */
export function gcj02ToWgs84(gcjLon: number, gcjLat: number): [number, number] {
  const gps = transform(gcjLon, gcjLat)
  return [gcjLon * 2 - gps[0], gcjLat * 2 - gps[1]]
}

function transform(lon: number, lat: number): [number, number] {
  if (!isInChina(lon, lat)) {
    return [lon, lat]
  }
  let dLat = transformLat(lon - 105.0, lat - 35.0)
  let dLon = transformLon(lon - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - 0.00669342162296594629 * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((EARTH_RADIUS * (1 - 0.00669342162296594629)) / (magic * sqrtMagic) * PI)
  dLon = (dLon * 180.0) / (EARTH_RADIUS / sqrtMagic * Math.cos(radLat) * PI)
  const mgLat = lat + dLat
  const mgLon = lon + dLon
  return [mgLon, mgLat]
}

function transformLat(x: number, y: number): number {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
  return ret
}

function transformLon(x: number, y: number): number {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
  return ret
}

/**
 * 经纬度转瓦片坐标
 * @param lon 经度
 * @param lat 纬度
 * @param zoom 缩放级别
 * @returns 瓦片坐标 [x, y, 瓦片内x坐标(0-255), 瓦片内y坐标(0-255)]
 */
export function lonLatToTile(lon: number, lat: number, zoom: number): [number, number, number, number] {
  const tileXY = Math.pow(2, zoom)
  const x = Math.floor((lon + 180) / 360 * tileXY)
  const y = Math.floor((1 - Math.log(Math.tan(lat * PI / 180) + 1 / Math.cos(lat * PI / 180)) / PI) / 2 * tileXY)
  
  // 瓦片内像素坐标
  const pixelX = Math.floor(((lon + 180) / 360 * tileXY - x) * 256)
  const pixelY = Math.floor((1 - (Math.log(Math.tan(lat * PI / 180) + 1 / Math.cos(lat * PI / 180)) / PI + 1) / 2 * tileXY + y) * 256)
  
  return [x, y, pixelX, pixelY]
}

/**
 * 瓦片坐标转经纬度
 * @param x 瓦片x坐标
 * @param y 瓦片y坐标
 * @param zoom 缩放级别
 * @param pixelX 瓦片内x像素坐标(默认0)
 * @param pixelY 瓦片内y像素坐标(默认0)
 * @returns 经纬度 [lon, lat]
 */
export function tileToLonLat(x: number, y: number, zoom: number, pixelX: number = 0, pixelY: number = 0): [number, number] {
  const tileXY = Math.pow(2, zoom)
  const lon = (x + pixelX / 256) / tileXY * 360 - 180
  const n = PI - 2 * PI * (y + pixelY / 256) / tileXY
  const lat = 180 / PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
  return [lon, lat]
}

/**
 * 根据相机距离计算当前合适的瓦片层级
 * @param cameraDistance 相机到地球中心距离
 * @returns 瓦片层级 1-18
 */
export function getZoomLevelByDistance(cameraDistance: number): number {
  // 距离范围和层级对应关系，根据实际效果调整
  if (cameraDistance > 8) return 3
  if (cameraDistance > 5) return 4
  if (cameraDistance > 3.5) return 5
  if (cameraDistance > 2.5) return 6
  if (cameraDistance > 2) return 7
  if (cameraDistance > 1.8) return 8
  if (cameraDistance > 1.6) return 9
  if (cameraDistance > 1.5) return 10
  if (cameraDistance > 1.4) return 11
  if (cameraDistance > 1.3) return 12
  if (cameraDistance > 1.25) return 13
  if (cameraDistance > 1.2) return 14
  if (cameraDistance > 1.15) return 15
  if (cameraDistance > 1.1) return 16
  if (cameraDistance > 1.05) return 17
  return 18
}
