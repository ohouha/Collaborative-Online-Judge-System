var express = require('express')
var app = express()
var mongoose=require('mongoose');
mongoose.connect('mongodb://user:123@ds137261.mlab.com:37261/ohouha');

var restRouter=require("./routes/res.js")
var indexRouters=require("./routes/index.js")

var path=require('path');

app.use(express.static(path.join(__dirname,'../public')));
app.use('/',indexRouters);

app.use('/api/v1',restRouter);

app.use(function(req,res,next){
  res.sendFile('index.html',{root:path.join(__dirname,'../public')});
}); //backend can't handle, so give them to front end

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// })

var http = require('http');
var socketIO = require('socket.io');
var io = socketIO();

var editorSocketService = require('./service/editorSocketService')(io);

// create http server
var server = http.createServer(app);
io.attach(server);
server.listen(3000);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  throw error;
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}