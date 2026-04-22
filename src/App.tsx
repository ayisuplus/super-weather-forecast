import { useState } from 'react'
import EarthModel from './components/EarthModel/EarthModel'
import Controls from './components/Controls/Controls'
import WeatherDetails from './components/UI/WeatherDetails'
import AlertPanel from './components/UI/AlertPanel'
import LoadingScreen from './components/UI/LoadingScreen'
import SettingsPanel from './components/UI/SettingsPanel'
import { DataDimension, TimeRange } from './types'

function App() {
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number; name: string } | null>(null)
  const [dataDimension, setDataDimension] = useState<DataDimension>('temperature')
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [showSettings, setShowSettings] = useState(false)

  // 模拟数据加载
  setTimeout(() => {
    setLoading(false)
  }, 2000)

  return (
    <div className="w-full h-full bg-gray-900 text-white">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          {/* 地球视图 */}
          <div className="absolute inset-0">
            <EarthModel 
              onLocationSelect={setSelectedLocation}
              dataDimension={dataDimension}
              timeRange={timeRange}
            />
          </div>

          {/* 预警信息 */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <AlertPanel />
          </div>

          {/* 控制面板 */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800 bg-opacity-80 p-4 z-20">
            <Controls 
              dataDimension={dataDimension}
              onDataDimensionChange={setDataDimension}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              onShowSettings={() => setShowSettings(!showSettings)}
            />
          </div>

          {/* 天气详情面板 */}
          {selectedLocation && (
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <WeatherDetails location={selectedLocation} />
            </div>
          )}

          {/* 设置面板 */}
          {showSettings && (
            <SettingsPanel onClose={() => setShowSettings(false)} />
          )}
        </>
      )}
    </div>
  )
}

export default App