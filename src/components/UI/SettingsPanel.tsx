import { useState } from 'react'
import { UserSettings } from '../../types'
import { loadSettings, saveSettings, addSavedLocation, removeSavedLocation } from '../../services/settings/settingsService'

interface SettingsPanelProps {
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<UserSettings>(loadSettings())
  const [newLocation, setNewLocation] = useState('')

  // 保存设置
  const handleSave = () => {
    saveSettings(settings)
    onClose()
  }

  // 添加地点
  const handleAddLocation = () => {
    if (newLocation) {
      // 这里应该调用地点搜索API，现在模拟添加
      const mockLocation = {
        name: newLocation,
        lat: 30.0 + Math.random() * 20,
        lon: 100.0 + Math.random() * 20
      }
      const updatedSettings = addSavedLocation(mockLocation)
      setSettings(updatedSettings)
      setNewLocation('')
    }
  }

  // 删除地点
  const handleRemoveLocation = (index: number) => {
    const updatedSettings = removeSavedLocation(index)
    setSettings(updatedSettings)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96 max-w-[90vw] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">设置</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* 常用地点 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">常用地点</h3>
          <div className="flex mb-3">
            <input
              type="text"
              placeholder="添加地点..."
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddLocation}
              className="px-4 py-2 bg-blue-600 rounded-r-lg hover:bg-blue-500"
            >
              添加
            </button>
          </div>
          <div className="space-y-2">
            {settings.savedLocations.map((location, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-gray-400">{location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°</div>
                </div>
                <button
                  onClick={() => handleRemoveLocation(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 显示偏好 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">显示偏好</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">默认数据维度</label>
              <select
                value={settings.dataPreferences.defaultDataDimension}
                onChange={(e) => setSettings({
                  ...settings,
                  dataPreferences: {
                    ...settings.dataPreferences,
                    defaultDataDimension: e.target.value as any
                  }
                })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="temperature">温度</option>
                <option value="precipitation">降水</option>
                <option value="wind">风速</option>
                <option value="pressure">气压</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">温度单位</label>
              <select
                value={settings.dataPreferences.temperatureUnit}
                onChange={(e) => setSettings({
                  ...settings,
                  dataPreferences: {
                    ...settings.dataPreferences,
                    temperatureUnit: e.target.value as any
                  }
                })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="celsius">摄氏度 (°C)</option>
                <option value="fahrenheit">华氏度 (°F)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 主题设置 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">主题</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSettings({ ...settings, theme: 'dark' })}
              className={`flex-1 py-2 rounded-lg ${settings.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              深色
            </button>
            <button
              onClick={() => setSettings({ ...settings, theme: 'light' })}
              className={`flex-1 py-2 rounded-lg ${settings.theme === 'light' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              浅色
            </button>
          </div>
        </div>

        {/* 性能设置 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">性能设置</h3>
          <div>
            <label className="block text-sm mb-1">渲染质量</label>
            <select
              value={settings.performance.renderQuality}
              onChange={(e) => setSettings({
                ...settings,
                performance: {
                  ...settings.performance,
                  renderQuality: e.target.value as any
                }
              })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-lg mr-2 hover:bg-gray-500"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel