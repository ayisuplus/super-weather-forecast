import { useState, useEffect } from 'react'
import { DataDimension, TimeRange, LocationSearchResult } from '../../types'
import { searchLocations } from '../../services/weather/weatherService'

interface ControlsProps {
  dataDimension: DataDimension
  onDataDimensionChange: (dimension: DataDimension) => void
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  onShowSettings: () => void
}

const Controls: React.FC<ControlsProps> = ({ 
  dataDimension, 
  onDataDimensionChange, 
  timeRange, 
  onTimeRangeChange, 
  onShowSettings 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // 处理地点搜索
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length > 1) {
        try {
          const results = await searchLocations(searchQuery)
          setSearchResults(results)
          setShowSearchResults(true)
        } catch (error) {
          console.error('搜索地点失败:', error)
        }
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }

    const timer = setTimeout(handleSearch, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // 数据维度选项
  const dataDimensions = [
    { value: 'temperature' as DataDimension, label: '温度', icon: '🌡️' },
    { value: 'precipitation' as DataDimension, label: '降水', icon: '💧' },
    { value: 'wind' as DataDimension, label: '风速', icon: '💨' },
    { value: 'pressure' as DataDimension, label: '气压', icon: '🌪️' }
  ]

  // 时间范围选项
  const timeRanges = [
    { value: '24h' as TimeRange, label: '24小时' },
    { value: '7d' as TimeRange, label: '7天' },
    { value: '30d' as TimeRange, label: '30天' }
  ]

  return (
    <div className="h-full overflow-y-auto">
      {/* 标题 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">控制面板</h2>
        <button 
          onClick={onShowSettings}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          ⚙️
        </button>
      </div>

      {/* 标题 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            天气地图
          </h1>
          <button 
            onClick={onShowSettings}
            className="p-2 rounded-lg hover:bg-white/10 transition-all btn-hover"
          >
            ⚙️
          </button>
        </div>

        {/* 数据维度选择 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <span className="mr-2">📊</span> 数据维度
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {dataDimensions.map((dimension) => (
              <button
                key={dimension.value}
                onClick={() => onDataDimensionChange(dimension.value)}
                className={`p-4 rounded-xl flex flex-col items-center transition-all duration-200 btn-hover ${
                  dataDimension === dimension.value 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-500/20' 
                    : 'glass hover:bg-white/15'
                }`}
              >
                <span className="text-3xl mb-2">{dimension.icon}</span>
                <span className="font-medium">{dimension.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 时间范围选择 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <span className="mr-2">⏰</span> 时间范围
          </h3>
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 btn-hover ${
                  timeRange === range.value 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20' 
                    : 'glass hover:bg-white/15'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* 地点搜索 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <span className="mr-2">🔍</span> 地点搜索
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="搜索城市..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
            />
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl shadow-2xl z-10 max-h-64 overflow-y-auto fade-in">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-white/10 cursor-pointer transition-all border-b border-white/5 last:border-0"
                    onClick={() => {
                      // 这里可以添加定位到该地点的逻辑
                      console.log('定位到:', result)
                      setSearchQuery(result.name)
                      setShowSearchResults(false)
                    }}
                  >
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-400">{result.country}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 常用地点 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <span className="mr-2">⭐</span> 常用地点
          </h3>
          <div className="space-y-2">
            {['北京', '上海', '广州', '深圳'].map((city, index) => (
              <div key={index} className="p-3 glass rounded-xl hover:bg-white/10 cursor-pointer transition-all card-hover">
                <div className="font-medium">{city}</div>
                <div className="text-sm text-gray-400">中国</div>
              </div>
            ))}
          </div>
        </div>

        {/* 帮助信息 */}
        <div className="glass rounded-xl p-4">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <span className="mr-2">💡</span> 使用提示
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p className="flex items-center">
              <span className="mr-2">🖱️</span> 拖拽旋转地球
            </p>
            <p className="flex items-center">
              <span className="mr-2">🖱️</span> 滚轮缩放视图
            </p>
            <p className="flex items-center">
              <span className="mr-2">👆</span> 点击查看天气
            </p>
            <p className="flex items-center">
              <span className="mr-2">🔄</span> 数据每15分钟更新
            </p>
          </div>
        </div>
    </div>
  )
}

export default Controls