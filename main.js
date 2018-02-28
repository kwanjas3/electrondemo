const electron = require('electron');
const url = require('url')
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

// SET ENV
process.env.NODE_ENV = 'production'

let mainWindow;

//Listen for app to be ready

app.on('ready', () => {
    //create new window
    mainWindow = new BrowserWindow({});
    //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    //quit app when closed
    mainWindow.on('closed', () => {
        app.quit();
    })
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

})

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item'
    });
    //load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    //garbage collection
    addWindow.on('close', () => {
        addWindow = null
    })
}
// garbage collection

//Catch item:add
ipcMain.on('item:add', (e, item)=>{
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

//create menu template

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [{
            label: 'Add Item',
            click() {
                createAddWindow();
            }
        },
        {
            label: 'Clear Item',
            click(){
                mainWindow.webContents.send('item:clear');
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }],
    }
];


// if mac, push empty object to menu
if(process.platform === 'darwin'){
mainMenuTemplate.unshift({});
}

//add dev tools item if not in prodution
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push(
        {
            label:'Developer Tools',
            accelerator: process.platform ==='darwin' ? 'Command+I' : 'Ctrl+I',
            submenu:[{
                label:'Toggle DevTools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },{
                role:'reload'
            }]
        }
    );
}