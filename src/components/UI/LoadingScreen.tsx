const LoadingScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
      <h2 className="text-2xl font-bold text-white mb-2">加载中</h2>
      <p className="text-gray-300">正在初始化地球模型和天气数据...</p>
    </div>
  )
}

export default LoadingScreen