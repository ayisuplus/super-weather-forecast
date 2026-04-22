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

      {/* 数据维度选择 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">数据维度</h3>
        <div className="grid grid-cols-2 gap-2">
          {dataDimensions.map((dimension) => (
            <button
              key={dimension.value}
              onClick={() => onDataDimensionChange(dimension.value)}
              className={`p-3 rounded-lg flex flex-col items-center ${dataDimension === dimension.value ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <span className="text-2xl mb-1">{dimension.icon}</span>
              <span>{dimension.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 时间范围选择 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">时间范围</h3>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => onTimeRangeChange(range.value)}
              className={`flex-1 py-2 rounded-lg ${timeRange === range.value ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* 地点搜索 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">地点搜索</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索城市..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
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
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">常用地点</h3>
        <div className="space-y-2">
          <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
            <div className="font-medium">北京</div>
            <div className="text-sm text-gray-400">中国</div>
          </div>
          <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
            <div className="font-medium">上海</div>
            <div className="text-sm text-gray-400">中国</div>
          </div>
          <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
            <div className="font-medium">广州</div>
            <div className="text-sm text-gray-400">中国</div>
          </div>
        </div>
      </div>

      {/* 帮助信息 */}
      <div>
        <h3 className="text-lg font-medium mb-3">使用帮助</h3>
        <div className="bg-gray-700 p-3 rounded-lg text-sm">
          <p className="mb-2">• 鼠标拖拽：旋转地球</p>
          <p className="mb-2">• 滚轮：缩放地球</p>
          <p className="mb-2">• 点击地球：查看详细天气</p>
          <p>• 选择数据维度：查看不同天气数据</p>
        </div>
      </div>
    </div>
  )
}

export default Controls