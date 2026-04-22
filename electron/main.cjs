const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

// 禁用默认菜单栏
Menu.setApplicationMenu(null)

let mainWindow

function createWindow () {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: '高级天气预报系统',
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      devTools: process.env.NODE_ENV === 'development', // 开发环境开启开发者工具
      contextIsolation: true,
      nodeIntegration: false
    },
    backgroundColor: '#0c192c',
    show: false // 先隐藏窗口，等加载完成后显示
  })

  // 加载应用
  if (process.env.NODE_ENV === 'development') {
    // 开发环境加载本地开发服务器
    mainWindow.loadURL('http://localhost:5173')
    // 打开开发者工具
    // mainWindow.webContents.openDevTools()
  } else {
    // 生产环境加载构建后的静态文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // 页面加载完成后显示窗口，避免白屏
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // 禁用窗口标题栏的右键菜单
  mainWindow.hookWindowMessage(278, () => {
    mainWindow.setEnabled(false)
    setTimeout(() => {
      mainWindow.setEnabled(true)
    }, 100)
    return true
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
