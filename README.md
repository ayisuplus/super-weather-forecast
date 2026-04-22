# 高级天气预报系统 Super Weather Forecast

基于3D地球的交互式高级天气预报系统，使用React+Three.js+TypeScript开发。

## ✨ 功能特性

- 🌍 **3D地球可视化**：使用Three.js实现真实的3D地球模型，支持缩放旋转
- 🗺️ **卫星瓦片分批次加载**：金字塔瓦片模型，根据缩放级别自动加载不同分辨率的卫星影像
- 🇨🇳 **省级行政区切换**：支持全国34个省级行政区快速定位和切换
- 🌡️ **实时天气查询**：点击任意位置查询当前天气和未来天气预报
- 📊 **多维数据可视化**：支持温度、降水、风速、气压等多种气象数据可视化
- 💾 **双层缓存机制**：内存+IndexedDB缓存，加速二次访问，减少重复请求
- 🖥️ **跨平台支持**：支持Web浏览器和Windows桌面客户端（Electron打包）

## 🛠️ 技术栈

- 前端框架：React 18 + TypeScript
- 3D引擎：Three.js + OrbitControls
- 构建工具：Vite 5
- 桌面打包：Electron + Electron Builder
- UI样式：Tailwind CSS
- 瓦片服务：高德公开卫星影像API

## 🚀 快速开始

### 开发模式

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 桌面客户端开发

```bash
npm run electron:dev
```

### 生产构建

```bash
# Web版本构建
npm run build

# Windows客户端打包（便携版）
npm run electron:build:portable
```

## 📦 下载安装

Windows 64位系统可直接下载最新便携版：[高级天气预报系统_v2.0.0_portable.exe](https://github.com/ayisuplus/super-weather-forecast/releases)

无需安装，下载后双击即可运行。

## 🎯 使用说明

1. **浏览地球**：鼠标拖拽旋转，滚轮缩放，右键平移
2. **查看天气**：点击地球上任意位置，弹出天气详情面板
3. **切换省份**：左上角下拉菜单选择省份，自动定位到对应区域
4. **数据切换**：右侧控制面板切换不同的气象数据维度（温度/降水/风速/气压）
5. **时间范围**：选择不同的时间范围查看天气预报

## 📁 项目结构

```
super-weather-forecast/
├── electron/                # Electron主进程代码
│   └── main.cjs
├── src/                     # 前端源代码
│   ├── components/          # React组件
│   │   ├── Controls/        # 控制面板
│   │   ├── EarthModel/      # 3D地球组件
│   │   └── UI/              # UI组件
│   ├── services/            # 服务层
│   │   ├── map/             # 地图瓦片服务
│   │   ├── settings/        # 设置服务
│   │   └── weather/         # 天气API服务
│   ├── data/                # 静态数据
│   │   └── provinces.ts     # 中国省级行政区数据
│   ├── types/               # TypeScript类型定义
│   ├── utils/               # 工具函数
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 应用入口
├── index.html               # HTML模板
├── vite.config.ts           # Vite配置
├── tailwind.config.js       # Tailwind CSS配置
└── package.json             # 项目配置
```

## 🔧 配置说明

项目使用OpenWeatherMap API获取天气数据，需要配置API Key：

1. 复制 `.env.example` 为 `.env`
2. 在 `.env` 中填写你的 `VITE_OPENWEATHER_API_KEY`
3. 重启开发服务器

如果没有API Key，项目会自动使用模拟数据运行。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！
