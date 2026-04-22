import { UserSettings } from '../../types'

// 默认设置
const defaultSettings: UserSettings = {
  savedLocations: [
    { name: '北京', lat: 39.9042, lon: 116.4074 },
    { name: '上海', lat: 31.2304, lon: 121.4737 },
    { name: '广州', lat: 23.1291, lon: 113.2644 }
  ],
  defaultView: {
    lat: 30.0,
    lon: 104.0,
    zoom: 2
  },
  dataPreferences: {
    defaultDataDimension: 'temperature',
    temperatureUnit: 'celsius'
  },
  theme: 'dark',
  performance: {
    renderQuality: 'medium'
  }
}

// 保存设置到本地存储
export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem('weatherAppSettings', JSON.stringify(settings))
  } catch (error) {
    console.error('保存设置失败:', error)
  }
}

// 从本地存储加载设置
export const loadSettings = (): UserSettings => {
  try {
    const storedSettings = localStorage.getItem('weatherAppSettings')
    if (storedSettings) {
      return JSON.parse(storedSettings)
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
  return defaultSettings
}

// 更新设置
export const updateSettings = (updates: Partial<UserSettings>): UserSettings => {
  const currentSettings = loadSettings()
  const newSettings = { ...currentSettings, ...updates }
  saveSettings(newSettings)
  return newSettings
}

// 添加保存的地点
export const addSavedLocation = (location: { name: string; lat: number; lon: number }): UserSettings => {
  const currentSettings = loadSettings()
  // 检查是否已存在
  const existingIndex = currentSettings.savedLocations.findIndex(
    loc => loc.lat === location.lat && loc.lon === location.lon
  )
  
  if (existingIndex === -1) {
    // 限制最多保存10个地点
    const savedLocations = [...currentSettings.savedLocations, location]
    if (savedLocations.length > 10) {
      savedLocations.shift() // 移除最早的地点
    }
    return updateSettings({ savedLocations })
  }
  
  return currentSettings
}

// 删除保存的地点
export const removeSavedLocation = (index: number): UserSettings => {
  const currentSettings = loadSettings()
  const savedLocations = [...currentSettings.savedLocations]
  savedLocations.splice(index, 1)
  return updateSettings({ savedLocations })
}