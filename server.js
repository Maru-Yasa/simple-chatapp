var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const db = require('./database/db')
const Message = require('./models/message')
require('dotenv').config()

db.once('open',() => {
    console.log('mongo ok!');
})
db.on('error',(err) => {
    console.log(err);
})

app.set('view engine','ejs')

app.get('/',async(req,res) => {
    let _data;
    await Message.find({},(err,data) => {
        if(err) console.log(err)
        _data = data
    })
    res.render('index',data= await _data)
})



app.use("*",(req,res) => {
    res.render('404')
})


var clients = []
io.on('connection', function(socket) {

    socket.broadcast.emit("clients",{
        clients:clients
    })

    socket.on('setName',(data) => {
        socket.nickname = data.name
        clients.push(socket.nickname)

        socket.broadcast.emit("clients",{
            clients:clients
        })
        socket.broadcast.emit("newConnection",{
            count:clients.length,
            msg: `${data.name} connected`
        })
        console.log(clients)

    })

    socket.on('msg',async(data) => {
        let dataMsg = new Message({
            sender:socket.nickname,
            msg:data.msg
        })
        await dataMsg.save()
        socket.broadcast.emit("msgBack",{
            msg:data.msg,
            sender:data.sender
        })
        socket.broadcast.emit("clients",{
            clients:clients
        })
    })

    socket.on('disconnect', function () {
        let idx = clients.indexOf(socket.nickname)
        socket.broadcast.emit('disconnectedUser',{
            msg:`${socket.nickname} disconnected`,
            count:clients.length
        })
        clients.splice(idx,1)
        socket.broadcast.emit("clients",{
            clients:clients
        })
    });

 });




server.listen(3000,() => {
    console.log('server ok')
})