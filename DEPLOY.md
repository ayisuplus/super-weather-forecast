# 高级天气预报系统 部署指南

## 📦 构建包说明
构建产物位于 `dist` 目录，包含：
```
dist/
├── index.html                # 入口文件
└── assets/
    ├── index-xxxxxx.css      # 样式文件
    └── index-xxxxxx.js       # 主程序文件
```

## 🚀 部署方式

### 1. 静态站点部署（推荐）
支持所有静态站点托管平台：
- **Vercel / Netlify**：直接上传 `dist` 目录或连接Git仓库自动部署
- **阿里云OSS / 腾讯云COS**：上传 `dist` 目录并开启静态网站托管
- **Nginx / Apache**：上传到服务器根目录，配置静态资源服务

### 2. 部署到Nginx示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 缓存策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 单页应用路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. Docker部署
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## ⚙️ 环境配置

### 配置API密钥
1. 复制 `.env.example` 为 `.env`
2. 填入OpenWeatherMap API密钥：
   ```env
   VITE_OPENWEATHER_API_KEY=your_actual_api_key
   ```
3. 重新执行 `npm run build` 生成带配置的构建包

### API申请地址
- OpenWeatherMap官网：https://openweathermap.org/api
- 免费版支持每分钟60次请求，足够个人使用

## 📋 部署检查清单
- [ ] 已申请并配置OpenWeatherMap API密钥
- [ ] 已执行 `npm run build` 生成生产构建包
- [ ] 已配置HTTPS证书（推荐使用Let's Encrypt）
- [ ] 已配置适当的缓存策略
- [ ] 已测试在不同浏览器/设备下正常访问
- [ ] 已配置错误页面和降级提示

## 🔧 性能优化建议
1. **CDN加速**：将静态资源托管到CDN，全球访问速度提升
2. **Gzip/Brotli压缩**：开启服务器压缩，传输体积减少70%以上
3. **HTTP缓存**：对静态资源设置长期缓存，提升二次加载速度
4. **按需加载**：后续版本可拆分代码，进一步提升首屏速度

## 📞 故障排查
- **天气数据不显示**：检查API密钥是否正确，控制台是否有跨域错误
- **3D地球不渲染**：检查浏览器是否支持WebGL，是否禁用了硬件加速
- **移动端卡顿**：可在设置中降低渲染精度，提升性能
