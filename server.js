var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/public/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

// Socket.io server listens to our app
const io = require('socket.io')(app);

// Send current time to all connected clients
function sendTime() {
    io.emit('time', { time:JSON.stringify('No of users connected right now : '+' '+parseInt(Math.random()*10))});
   
}

// Send current time every 10 secs
setInterval(sendTime, 1000);

// Emit welcome message on connection
io.on('connection',(socket)=>{
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    setInterval(()=>{
     // socket.emit('number', parseInt(Math.random()*10));
      console.log('No of users  :'+parseInt(Math.random()*10));
    }, 10000);
  });

app.listen(3000);