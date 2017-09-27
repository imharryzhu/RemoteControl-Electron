const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    titleBarStyle: "hidden", // MAC隐藏菜单栏
    // show: false, // 将界面的显示延迟到 'ready-to-show'
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  setupApplicationMenu()

  // mainWindow.openDevTools();
}

function setupApplicationMenu() {
  var application_menu = [
    {
      label: 'menu1',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          click: () => {
            mainWindow.openDevTools();
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            electron.dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
          }
        },
        {
          label: 'submenu1',
          submenu: [
            {
              label: 'item1',
              accelerator: 'CmdOrCtrl+A',
              click: () => {
                mainWindow.openDevTools();
              }
            },
            {
              label: 'item2',
              accelerator: 'CmdOrCtrl+B',
              click: () => {
                mainWindow.closeDevTools();
              }
            },
            {
              lable: 'close',
              accelerator: 'CmdOrCtrl+W',
              click: () => {
                mainWindow.close()
              }
            }
          ]
        }
      ]
    }
  ];
  if (process.platform == 'darwin') {
    setupMacosMenu(application_menu)
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(application_menu))
}

function setupMacosMenu(menu_template) {
  const name = app.getName();
  menu_template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => { app.quit(); }
      },
    ]
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
