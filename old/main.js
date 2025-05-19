// main.js

const { app, BrowserWindow } = require('electron');

const path = require('path');

function createWindow() {

  const win = new BrowserWindow({

    width: 1200,

    height: 800,

    webPreferences: {

      nodeIntegration: false,

    },

  });

  win.loadURL('http://localhost:3000'); // during dev

  // win.loadFile('out/index.html'); // for production build

}

app.whenReady().then(createWindow);