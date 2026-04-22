import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
// @ts-ignore - OrbitControls类型声明可能存在问题
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DataDimension, TimeRange, GlobalWeatherData } from '../../types'
import { getGlobalWeather } from '../../services/weather/weatherService'

interface EarthModelProps {
  onLocationSelect: (location: { lat: number; lon: number; name: string }) => void
  dataDimension: DataDimension
  timeRange: TimeRange
}

const EarthModel: React.FC<EarthModelProps> = ({ onLocationSelect, dataDimension, timeRange }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const earthRef = useRef<THREE.Mesh | null>(null)
  const weatherDataRef = useRef<GlobalWeatherData | null>(null)
  const weatherPointsRef = useRef<THREE.Points | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const [loading, setLoading] = useState(true)

  // 初始化Three.js场景
  useEffect(() => {
    if (!containerRef.current) return

    // 创建场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000033)
    sceneRef.current = scene

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 2
    cameraRef.current = camera

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 1.5
    controls.maxDistance = 5
    controlsRef.current = controls

    // 创建地球
    const createEarth = () => {
      // 地球几何体
      const geometry = new THREE.SphereGeometry(1, 64, 64)
      
      // 地球材质
      const material = new THREE.MeshBasicMaterial({
        color: 0x0066cc,
        wireframe: false
      })
      
      const earth = new THREE.Mesh(geometry, material)
      scene.add(earth)
      earthRef.current = earth

      // 添加大气层效果
      const atmosphereGeometry = new THREE.SphereGeometry(1.02, 64, 64)
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x0099ff,
        transparent: true,
        opacity: 0.3
      })
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
      scene.add(atmosphere)

      // 添加环境光
      const ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)

      // 添加平行光（模拟太阳）
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 3, 5)
      scene.add(directionalLight)
    }

    createEarth()

    // 处理窗口大小变化
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // 动画循环
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      // 地球自转
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.001
      }

      // 更新控制器
      if (controlsRef.current) {
        controlsRef.current.update()
      }

      // 渲染场景
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    // 点击事件处理
    const handleClick = (event: MouseEvent) => {
      if (!cameraRef.current || !sceneRef.current) return

      // 计算鼠标位置
      const mouse = new THREE.Vector2()
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // 创建射线
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, cameraRef.current)

      // 检测点击
      const intersects = raycaster.intersectObjects(sceneRef.current.children)
      if (intersects.length > 0) {
        // 获取点击位置的坐标
        const point = intersects[0].point
        
        // 转换为经纬度
        const lat = Math.asin(point.y / point.length()) * (180 / Math.PI)
        const lon = Math.atan2(point.z, point.x) * (180 / Math.PI)
        
        // 触发位置选择回调
        onLocationSelect({
          lat,
          lon,
          name: `位置 (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`
        })
      }
    }

    window.addEventListener('click', handleClick)

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('click', handleClick)
      
      // 取消动画
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [onLocationSelect])

  // 获取全球天气数据
  useEffect(() => {
    const fetchGlobalWeather = async () => {
      setLoading(true)
      try {
        const data = await getGlobalWeather(3)
        weatherDataRef.current = data
        updateWeatherVisualization()
      } catch (error) {
        console.error('获取全球天气数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGlobalWeather()
  }, [])

  // 数据维度变化时更新地球可视化
  useEffect(() => {
    updateWeatherVisualization()
  }, [dataDimension])

  // 时间范围变化时更新地球可视化
  useEffect(() => {
    // 这里可以根据时间范围更新地球的天气数据
    console.log('时间范围变化:', timeRange)
  }, [timeRange])

  // 更新天气可视化
  const updateWeatherVisualization = () => {
    if (!sceneRef.current || !weatherDataRef.current) return

    // 移除旧的天气点
    if (weatherPointsRef.current) {
      sceneRef.current.remove(weatherPointsRef.current)
    }

    const data = weatherDataRef.current
    const pointsGeometry = new THREE.BufferGeometry()
    const pointsMaterial = new THREE.PointsMaterial({ size: 0.01 })

    const positions: number[] = []
    const colors: number[] = []

    data.grid.forEach(item => {
      // 转换经纬度为3D坐标
      const lat = item.lat * Math.PI / 180
      const lon = item.lon * Math.PI / 180
      const radius = 1.01

      const x = radius * Math.cos(lat) * Math.cos(lon)
      const y = radius * Math.sin(lat)
      const z = radius * Math.cos(lat) * Math.sin(lon)

      positions.push(x, y, z)

      // 根据数据维度设置颜色
      let color: THREE.Color
      switch (dataDimension) {
        case 'temperature':
          // 温度颜色映射：蓝色（-20）到红色（40）
          const tempNorm = (item.temp + 20) / 60
          color = new THREE.Color().setHSL(0.6 * (1 - tempNorm), 1, 0.5)
          break
        case 'precipitation':
          // 降水颜色映射：白色（0）到蓝色（100）
          const precipNorm = Math.min(item.humidity / 100, 1)
          color = new THREE.Color().setRGB(0, 0, 1 * precipNorm)
          break
        case 'wind':
          // 风速颜色映射：绿色（0）到黄色（20）
          const windNorm = Math.min(item.windSpeed / 20, 1)
          color = new THREE.Color().setRGB(windNorm, 1 - windNorm, 0)
          break
        case 'pressure':
          // 气压颜色映射：紫色（980）到橙色（1020）
          const pressureNorm = (item.pressure - 980) / 40
          color = new THREE.Color().setHSL(0.1 * pressureNorm, 1, 0.5)
          break
        default:
          color = new THREE.Color(0xffffff)
      }

      colors.push(color.r, color.g, color.b)
    })

    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    pointsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    pointsMaterial.vertexColors = true

    const points = new THREE.Points(pointsGeometry, pointsMaterial)
    sceneRef.current.add(points)
    weatherPointsRef.current = points
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  )
}

export default EarthModel