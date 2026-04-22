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
      <div className="glass-light p-6 rounded-t-2xl shadow-2xl">
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
        </div>
      </div>
    )
  }

  if (!currentWeather) {
    return (
      <div className="glass-light p-6 rounded-t-2xl shadow-2xl">
        <p className="text-center text-red-400">无法获取天气数据</p>
      </div>
    )
  }

  return (
    <div className="glass-light p-6 rounded-t-2xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{location.name}</h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all duration-200 text-sm font-medium btn-hover">
          ⭐ 保存地点
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col justify-center">
          <p className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {Math.round(currentWeather.main.temp)}°
          </p>
          <p className="text-lg text-gray-300 mt-2 capitalize">{currentWeather.weather[0].description}</p>
          <p className="text-sm text-gray-400 mt-1">
            体感 {Math.round(currentWeather.main.feels_like)}°
          </p>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="glass p-3 rounded-xl card-hover">
            <p className="text-xs text-blue-300 mb-1">💧 湿度</p>
            <p className="text-xl font-semibold">{currentWeather.main.humidity}%</p>
          </div>
          <div className="glass p-3 rounded-xl card-hover">
            <p className="text-xs text-purple-300 mb-1">🌡️ 气压</p>
            <p className="text-xl font-semibold">{currentWeather.main.pressure} hPa</p>
          </div>
          <div className="glass p-3 rounded-xl card-hover">
            <p className="text-xs text-green-300 mb-1">💨 风速</p>
            <p className="text-xl font-semibold">{currentWeather.wind.speed.toFixed(1)} m/s</p>
          </div>
          <div className="glass p-3 rounded-xl card-hover">
            <p className="text-xs text-yellow-300 mb-1">🧭 风向</p>
            <p className="text-xl font-semibold">{currentWeather.wind.deg}°</p>
          </div>
        </div>
      </div>

      {/* 7天预报 */}
      {forecast && (
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <span className="mr-2">📅</span> 7天预报
          </h3>
          <div className="flex overflow-x-auto space-x-3 pb-3">
            {forecast.list.filter((_, index) => index % 8 === 0).map((item, index) => {
              const date = new Date(item.dt * 1000)
              return (
                <div key={index} className="glass p-4 rounded-xl min-w-[90px] text-center card-hover">
                  <p className="text-sm font-medium text-gray-300">{date.toLocaleDateString('zh-CN', { weekday: 'short' })}</p>
                  <p className="text-2xl my-2 font-bold">{Math.round(item.main.temp)}°</p>
                  <p className="text-xs text-gray-400 capitalize">{item.weather[0].main}</p>
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