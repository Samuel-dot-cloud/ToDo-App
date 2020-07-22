'use strict'
const { BrowserWindow } = require('electron')
    //default window settings
const defaultProps = {
    width: 500,
    height: 800,
    show: false
}

class Window extends BrowserWindow {
    constructor({ file, ...windowSettings }) {
        // calls new browserwindow with props
        super({...defaultProps, ...windowSettings })

        //load the html and opens devtools
        this.loadFile(file)
        this.webContents.openDevTools()

        //shows when ready to prevent flickering
        this.once('ready-to-show', () => {
            this.show()
        })
    }
}
module.exports = Window