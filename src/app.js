import express from 'express'
import http from "node:http"
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)

const io = new Server(server)
app.use(express.static('src/public'))


let socketsConected = new Set()


io.on('connection', onConnected)

function onConnected(socket) {
  console.log(socket.id)
  socketsConected.add(socket.id)

  io.emit('clients-total', socketsConected.size)

  socket.on("disconnect", () => {
    console.log(socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  socket.on('message', (data) => {
    console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}



export default server
