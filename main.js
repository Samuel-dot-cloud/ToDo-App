'use strict'

const { app, ipcMain } = require('electron')
const path = require('path')


const Window = require('./window')
const DataStore = require('./DataStore')

// Create a new todo store named "Todos Main"
const todosData = new DataStore({ name: 'Todos Main' })

function main() {
    let mainWindow = new Window({
        file: path.join('renderer', 'index.html')
    })

    //add todo window(initially does not exist)
    let addTodoWin

    // TODO: put these events into their own file

    // Initialize with todos
    mainWindow.once('show', () => {
        mainWindow.webContents.send('todos', todosData.todos)
    })

    //create add todo window
    ipcMain.on('add-todo-window', () => {
        //if addTodoWin does not already exist
        if (!addTodoWin) {
            //create a new add todo window
            addTodoWin = new Window({
                file: path.join('renderer', 'add.html'),
                width: 400,
                height: 400,
                //close with the main window
                parent: mainWindow
            })

            //cleanup
            addTodoWin.on('closed', () => {
                addTodoWin = null
            })
        }
    })

    //add-todo from add todo window
    ipcMain.on('add-todo', (event, todo) => {
        const updatedTodos = todosData.addTodo(todo).todos

        mainWindow.send('todos', updatedTodos)
    })
}
app.on('ready', main)


app.on('window-all-closed', function() {
    app.quit()
})