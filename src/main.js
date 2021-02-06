// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, Tray, Menu } = require('electron');
const path = require('path');
const ms = require('ms');

let win = null;
let appIcon = null;

const createWindow = () => {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        transparent: true,
        fullscreen: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        show: true,
    });

    // win.hide();

    // and load the index.html of the app.
    win.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

let TIME = ms('15m');
let t;

const postureTimer = () => {
    t = setTimeout(() => {
        win.show();
        win.setFullScreen(true);
        //win.maximize();
        clearTimeout(t);
    }, TIME);
};

const iconPath = path.join(__dirname, '/assets/posture_check.png');
const contextMenu = Menu.buildFromTemplate([
    {
        label: 'Times',
        submenu: [
            {
                type: 'radio',
                label: '10 min',
                click: item => {
                    TIME = ms('10m');
                    item.checked = true;
                    postureTimer();
                },
            },
            {
                type: 'radio',
                label: '15 min (recommended)',
                click: item => {
                    TIME = ms('15m');
                    item.checked = true;
                    postureTimer();
                },
                checked: true,
            },
            {
                type: 'radio',
                label: '20 min',
                click: item => {
                    TIME = ms('20m');
                    item.checked = true;
                    postureTimer();
                },
            },
        ],
    },
    {
        label: 'Close',
        click: () => {
            win.destroy();
            app.quit();
        },
    },
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    setTimeout(() => {
        createWindow();
    }, 500);

    const tray = new Tray(iconPath);
    tray.setToolTip('Posture Check App');
    // tray.setContextMenu(contextMenu);

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) win = createWindow();
    });

    globalShortcut.register('Esc', () => {
        if (win.isMinimized()) return;
        win.hide();
        tray.setContextMenu(contextMenu);
        postureTimer();
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
    if (appIcon) appIcon.destroy();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
