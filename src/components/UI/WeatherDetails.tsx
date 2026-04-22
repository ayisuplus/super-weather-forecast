import { useState, useEffect } from 'react'
import { getCurrentWeather, getForecast } from '../../services/weather/weatherService'
import { WeatherData, ForecastData } from '../../types'

interface WeatherDetailsProps {
  location: { lat: number; lon: number; name: string }
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ location }) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      try {
        // 获取当前天气
        const currentData = await getCurrentWeather(location.lat, location.lon)
        setCurrentWeather(currentData)

        // 获取7天预报
        const forecastData = await getForecast(location.lat, location.lon, 7)
        setForecast(forecastData)
      } catch (error) {
        console.error('获取天气数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [location])

  if (loading) {
    return (
      <div className="bg-gray-800 bg-opacity-80 p-4 rounded-t-lg">
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!currentWeather) {
    return (
      <div className="bg-gray-800 bg-opacity-80 p-4 rounded-t-lg">
        <p className="text-center text-red-400">无法获取天气数据</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 bg-opacity-80 p-4 rounded-t-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{location.name}</h2>
        <button className="text-blue-400 hover:text-blue-300">
          保存地点
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-4xl font-bold">{Math.round(currentWeather.main.temp)}°C</p>
          <p className="text-gray-300">{currentWeather.weather[0].description}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-700 p-2 rounded">
            <p className="text-sm text-gray-300">湿度</p>
            <p className="font-medium">{currentWeather.main.humidity}%</p>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <p className="text-sm text-gray-300">气压</p>
            <p className="font-medium">{currentWeather.main.pressure} hPa</p>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <p className="text-sm text-gray-300">风速</p>
            <p className="font-medium">{currentWeather.wind.speed.toFixed(1)} m/s</p>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <p className="text-sm text-gray-300">风向</p>
            <p className="font-medium">{currentWeather.wind.deg}°</p>
          </div>
        </div>
      </div>

      {/* 7天预报 */}
      {forecast && (
        <div>
          <h3 className="text-lg font-medium mb-2">7天预报</h3>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {forecast.list.filter((_, index) => index % 8 === 0).map((item, index) => {
              const date = new Date(item.dt * 1000)
              return (
                <div key={index} className="bg-gray-700 p-3 rounded min-w-[80px] text-center">
                  <p className="text-sm">{date.toLocaleDateString('zh-CN', { weekday: 'short' })}</p>
                  <p className="text-xl my-1">{Math.round(item.main.temp)}°</p>
                  <p className="text-xs text-gray-300">{item.weather[0].main}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherDetails