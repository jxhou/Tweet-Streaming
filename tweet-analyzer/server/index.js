const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
const config = require('dotenv').config()
const redis = require('redis')
const tweetAnalyzer = require('./tweetHandlers/tweetStreamAnalyzer')
const tweetHandler = require('./tweetHandlers/tweetProcessor')

const PORT = process.env.PORT || 3000

const app = new express();
const server = http.createServer(app)
const io = socketIo(server)
const tweetProcessor = require('./tweetHandlers/tweetProcessor')

app.use(express.static(__dirname + '/../client')); //Serves resources from public folder
console.log(__dirname);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/stats', (req, res) => {
  res.status(200).json(tweetProcessor.getStats())
})

tweetAnalyzer.start();

io.on('connection', async () => {
  console.log('Client connected...')
  io.emit('tweetStats', {message: 'ok'})
  tweetHandler.registerNotificationSocket(io);
});

server.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`)
})


