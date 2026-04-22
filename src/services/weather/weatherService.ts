import axios from 'axios'
import { WeatherData, ForecastData, GlobalWeatherData, LocationSearchResult, ExtremeWeatherEvent } from '../../types'

// API配置
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'DEMO_KEY'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'
const USE_MOCK_DATA = !API_KEY || API_KEY === 'YOUR_OPENWEATHER_API_KEY' || API_KEY === 'DEMO_KEY'

// 创建axios实例
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric' // 使用摄氏度
  }
})

// 创建地理编码API实例
const geoApiClient = axios.create({
  baseURL: GEO_URL,
  params: {
    appid: API_KEY
  }
})

// 获取当前天气数据
export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  if (USE_MOCK_DATA) {
    console.log('使用模拟天气数据')
    return getMockCurrentWeather(lat, lon)
  }

  try {
    console.log('调用OpenWeatherMap API获取天气数据')
    const response = await apiClient.get('/weather', {
      params: { lat, lon, lang: 'zh_cn' } // 返回中文描述
    })
    return response.data
  } catch (error) {
    console.error('获取当前天气失败，回退到模拟数据:', error)
    // 失败时返回模拟数据
    return getMockCurrentWeather(lat, lon)
  }
}

// 获取天气预报数据
export const getForecast = async (lat: number, lon: number, days: number): Promise<ForecastData> => {
  if (USE_MOCK_DATA) {
    return getMockForecast(lat, lon, days)
  }

  try {
    console.log('调用OpenWeatherMap API获取天气预报')
    const response = await apiClient.get('/forecast', {
      params: { lat, lon, cnt: days * 8, lang: 'zh_cn' } // 每3小时一个数据点，一天8个
    })
    return response.data
  } catch (error) {
    console.error('获取天气预报失败，回退到模拟数据:', error)
    // 失败时返回模拟数据
    return getMockForecast(lat, lon, days)
  }
}

// 获取全球天气数据（模拟）
export const getGlobalWeather = async (zoom: number): Promise<GlobalWeatherData> => {
  try {
    // 实际项目中，这里应该调用支持全球天气数据的API
    // 现在返回模拟数据
    return getMockGlobalWeather(zoom)
  } catch (error) {
    console.error('获取全球天气失败:', error)
    return getMockGlobalWeather(zoom)
  }
}

// 搜索地点
export const searchLocations = async (query: string, limit: number = 5): Promise<LocationSearchResult[]> => {
  if (USE_MOCK_DATA) {
    return getMockLocationSearch(query, limit)
  }

  try {
    console.log('调用地理编码API搜索地点')
    const response = await geoApiClient.get('/direct', {
      params: {
        q: query,
        limit
      }
    })
    return response.data
  } catch (error) {
    console.error('搜索地点失败，回退到模拟数据:', error)
    // 返回模拟数据
    return getMockLocationSearch(query, limit)
  }
}

// 获取极端天气事件（模拟）
export const getExtremeWeatherEvents = async (): Promise<ExtremeWeatherEvent[]> => {
  try {
    // 实际项目中，这里应该调用支持极端天气事件的API
    // 现在返回模拟数据
    return getMockExtremeWeatherEvents()
  } catch (error) {
    console.error('获取极端天气事件失败:', error)
    return getMockExtremeWeatherEvents()
  }
}

// 模拟数据
const getMockCurrentWeather = (lat: number, lon: number): WeatherData => {
  return {
    id: '123456',
    name: `位置 (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
    coord: { lat, lon },
    weather: [{
      id: 800,
      main: 'Clear',
      description: '晴天',
      icon: '01d'
    }],
    main: {
      temp: 25 + Math.random() * 10,
      feels_like: 26 + Math.random() * 10,
      temp_min: 20 + Math.random() * 5,
      temp_max: 30 + Math.random() * 5,
      pressure: 1013 + Math.random() * 20,
      humidity: 50 + Math.random() * 30
    },
    wind: {
      speed: 5 + Math.random() * 10,
      deg: Math.random() * 360
    },
    dt: Date.now() / 1000
  }
}

const getMockForecast = (_lat: number, _lon: number, days: number): ForecastData => {
  const list = []
  const now = Date.now() / 1000

  for (let i = 0; i < days * 8; i++) {
    list.push({
      dt: now + i * 3600 * 3,
      main: {
        temp: 20 + Math.random() * 15,
        feels_like: 21 + Math.random() * 15,
        temp_min: 18 + Math.random() * 10,
        temp_max: 25 + Math.random() * 10,
        pressure: 1010 + Math.random() * 20,
        humidity: 40 + Math.random() * 40
      },
      weather: [{
        id: 800 + Math.floor(Math.random() * 4),
        main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
        description: ['晴天', '多云', '雨天', '雪天'][Math.floor(Math.random() * 4)],
        icon: ['01d', '02d', '09d', '13d'][Math.floor(Math.random() * 4)]
      }],
      wind: {
        speed: 3 + Math.random() * 12,
        deg: Math.random() * 360
      }
    })
  }

  return { list }
}

const getMockGlobalWeather = (zoom: number): GlobalWeatherData => {
  const grid = []
  const step = zoom > 3 ? 10 : 20

  for (let lat = -90; lat <= 90; lat += step) {
    for (let lon = -180; lon <= 180; lon += step) {
      grid.push({
        lat,
        lon,
        temp: -20 + Math.random() * 60,
        humidity: 20 + Math.random() * 60,
        windSpeed: 0 + Math.random() * 20,
        pressure: 980 + Math.random() * 40
      })
    }
  }

  return { grid }
}

const getMockLocationSearch = (query: string, limit: number): LocationSearchResult[] => {
  const mockLocations = [
    { name: '北京', lat: 39.9042, lon: 116.4074, country: 'CN' },
    { name: '上海', lat: 31.2304, lon: 121.4737, country: 'CN' },
    { name: '广州', lat: 23.1291, lon: 113.2644, country: 'CN' },
    { name: '深圳', lat: 22.5431, lon: 114.0579, country: 'CN' },
    { name: '杭州', lat: 30.2741, lon: 120.1551, country: 'CN' },
    { name: '纽约', lat: 40.7128, lon: -74.0060, country: 'US' },
    { name: '伦敦', lat: 51.5074, lon: -0.1278, country: 'GB' },
    { name: '东京', lat: 35.6762, lon: 139.6503, country: 'JP' },
    { name: '巴黎', lat: 48.8566, lon: 2.3522, country: 'FR' },
    { name: '悉尼', lat: -33.8688, lon: 151.2093, country: 'AU' }
  ]

  return mockLocations
    .filter(location => location.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit)
}

const getMockExtremeWeatherEvents = (): ExtremeWeatherEvent[] => {
  return [
    {
      id: '1',
      type: '台风',
      location: { lat: 20.0, lon: 120.0 },
      severity: '严重',
      description: '台风"玛莉亚"正在逼近菲律宾东部海域'
    },
    {
      id: '2',
      type: '暴雨',
      location: { lat: 30.0, lon: 120.0 },
      severity: '中度',
      description: '江南地区将出现持续暴雨天气'
    },
    {
      id: '3',
      type: '高温',
      location: { lat: 35.0, lon: 110.0 },
      severity: '严重',
      description: '华北地区将出现40℃以上高温天气'
    }
  ]
}