/**
 * 中国省份数据
 * 包含省份名称、经纬度中心、视图半径、推荐缩放级别
 */
export interface ProvinceData {
  name: string
  lon: number
  lat: number
  viewRadius: number // 视图半径（度）
  zoom: number // 推荐缩放级别
}

export const provinces: ProvinceData[] = [
  { name: '北京市', lon: 116.4074, lat: 39.9042, viewRadius: 3, zoom: 10 },
  { name: '天津市', lon: 117.2008, lat: 39.0842, viewRadius: 3, zoom: 10 },
  { name: '河北省', lon: 114.5148, lat: 38.0423, viewRadius: 6, zoom: 8 },
  { name: '山西省', lon: 112.5489, lat: 37.8706, viewRadius: 6, zoom: 8 },
  { name: '内蒙古自治区', lon: 111.6708, lat: 40.8183, viewRadius: 10, zoom: 6 },
  { name: '辽宁省', lon: 123.4328, lat: 41.8045, viewRadius: 5, zoom: 8 },
  { name: '吉林省', lon: 125.3245, lat: 43.8868, viewRadius: 5, zoom: 8 },
  { name: '黑龙江省', lon: 126.5350, lat: 45.8038, viewRadius: 6, zoom: 7 },
  { name: '上海市', lon: 121.4737, lat: 31.2304, viewRadius: 3, zoom: 10 },
  { name: '江苏省', lon: 118.7674, lat: 32.0603, viewRadius: 4, zoom: 9 },
  { name: '浙江省', lon: 120.1536, lat: 30.2875, viewRadius: 4, zoom: 9 },
  { name: '安徽省', lon: 117.2830, lat: 31.8612, viewRadius: 4, zoom: 9 },
  { name: '福建省', lon: 119.2965, lat: 26.1013, viewRadius: 4, zoom: 9 },
  { name: '江西省', lon: 115.8922, lat: 28.6765, viewRadius: 4, zoom: 9 },
  { name: '山东省', lon: 117.0009, lat: 36.6758, viewRadius: 4, zoom: 9 },
  { name: '河南省', lon: 113.6147, lat: 34.7579, viewRadius: 4, zoom: 9 },
  { name: '湖北省', lon: 114.3054, lat: 30.5931, viewRadius: 4, zoom: 9 },
  { name: '湖南省', lon: 112.9823, lat: 28.1941, viewRadius: 4, zoom: 9 },
  { name: '广东省', lon: 113.2644, lat: 23.1291, viewRadius: 4, zoom: 9 },
  { name: '广西壮族自治区', lon: 108.3276, lat: 22.8154, viewRadius: 5, zoom: 8 },
  { name: '海南省', lon: 110.3492, lat: 20.0174, viewRadius: 3, zoom: 10 },
  { name: '重庆市', lon: 106.5516, lat: 29.5630, viewRadius: 3, zoom: 10 },
  { name: '四川省', lon: 104.0757, lat: 30.6599, viewRadius: 5, zoom: 8 },
  { name: '贵州省', lon: 106.7135, lat: 26.5783, viewRadius: 4, zoom: 9 },
  { name: '云南省', lon: 102.7123, lat: 25.0406, viewRadius: 5, zoom: 8 },
  { name: '西藏自治区', lon: 91.1175, lat: 29.6469, viewRadius: 8, zoom: 7 },
  { name: '陕西省', lon: 108.9398, lat: 34.3416, viewRadius: 4, zoom: 9 },
  { name: '甘肃省', lon: 103.8236, lat: 36.0580, viewRadius: 6, zoom: 8 },
  { name: '青海省', lon: 101.7778, lat: 36.6171, viewRadius: 7, zoom: 7 },
  { name: '宁夏回族自治区', lon: 106.2731, lat: 38.4738, viewRadius: 4, zoom: 9 },
  { name: '新疆维吾尔自治区', lon: 87.6168, lat: 43.8256, viewRadius: 10, zoom: 6 },
  { name: '台湾省', lon: 121.5170, lat: 25.0478, viewRadius: 2, zoom: 10 },
  { name: '香港特别行政区', lon: 114.1728, lat: 22.2855, viewRadius: 1, zoom: 12 },
  { name: '澳门特别行政区', lon: 113.5491, lat: 22.1987, viewRadius: 0.5, zoom: 13 },
  { name: '中国全境', lon: 116.4074, lat: 39.9042, viewRadius: 40, zoom: 4 }
]

export const defaultProvince = provinces[provinces.length - 1] // 默认中国全境
