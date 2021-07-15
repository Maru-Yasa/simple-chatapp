var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.set('view engine','ejs')

app.get('/',(req,res) => {
    res.render('index')
})

app.use("*",(req,res) => {
    res.render('404')
})

var client = 0
var clients = []
io.on('connection', function(socket) {
    client++;
    socket.broadcast.emit("newConnection",{
        count:client,
        msg: `${socket.id} connected`
    })

    socket.on('setName',(data) => {
        clients.push(data.name)
        console.log(data.name);
    })

    socket.on('msg',(data) => {
        socket.broadcast.emit("msgBack",{
            msg:data.msg,
            sender:data.sender
        })
    })

    socket.on('disconnect', function () {
        client--;
        socket.broadcast.emit('disconnectedUser',{
            msg:`${socket.id} disconnected`,
            count:client
        })
    });
 });
server.listen(3000,() => {
    console.log('server ok')
})