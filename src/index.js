import server from './app.js'

const PORT = process.env.PORT || 4000

server.listen(PORT, () => console.log(`👻 server on port ${PORT} - http://localhost:${PORT}`))
