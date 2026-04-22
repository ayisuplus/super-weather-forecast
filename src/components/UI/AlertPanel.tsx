import { useState, useEffect } from 'react'
import { getExtremeWeatherEvents } from '../../services/weather/weatherService'
import { ExtremeWeatherEvent } from '../../types'

const AlertPanel: React.FC = () => {
  const [events, setEvents] = useState<ExtremeWeatherEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(false) // 模拟加载
      try {
        const data = await getExtremeWeatherEvents()
        setEvents(data)
      } catch (error) {
        console.error('获取极端天气事件失败:', error)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return null
  }

  if (events.length === 0) {
    return null
  }

  return (
    <div className="bg-red-900 bg-opacity-80 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold flex items-center">
          <span className="mr-2">⚠️</span> 极端天气预警
        </h3>
        <button className="text-sm text-gray-300 hover:text-white">
          查看全部
        </button>
      </div>
      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="bg-red-800 bg-opacity-50 p-2 rounded">
            <div className="flex justify-between">
              <span className="font-medium">{event.type}</span>
              <span className={`px-2 py-1 rounded text-xs ${event.severity === '严重' ? 'bg-red-600' : 'bg-yellow-600'}`}>
                {event.severity}
              </span>
            </div>
            <p className="text-sm mt-1">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertPanel