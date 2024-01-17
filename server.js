const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');
const {AxiosGetData, dbConnect} = require('./serverUtilities.js');



const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const expressApp = express();
const server = createServer(expressApp);
const io = socketIO(server);

app.prepare().then(() => {
  expressApp.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === '/a') {
      app.render(req, res, '/a', query);
    } else if (pathname === '/b') {
      app.render(req, res, '/b', query);
    } else {
      handle(req, res, parsedUrl);
    }
  });

  io.on('connection', (socket) => {
    console.log('connected with new id: '+ socket.id);
    

    socket.on('checkUser',(data)=>{
      //check the userid from the data variable and add him to the specified room. If No room available just tell the 
      //create a new chat room
      //data is of the form data:{ userid: studQEUDNFK, clickeduserid:12, socket.id: socketID}
     //console.log('checking User...')
      dbConnect.connect(function(err) {
        if (err) throw err;
       // console.log(data)
        dbConnect.execute(`SELECT * FROM inquiries WHERE senderID = ? AND receiverID=? OR senderID = ?  AND receiverID=?`,[data.userid,data.clickeduserid,data.clickeduserid,data.userid], function (err, result, fields) {
          if (err) throw err;
          if(result.length == 0){
            //no result returned. Create new chat room
            var roomID = Math.floor(Math.random() * 10000) + 1;
            //now insert the sender and receiver plus the room id to the db
            dbConnect.execute("INSERT INTO inquiries (senderID, receiverID, roomID) VALUES (?,?,?)",[data.userid, data.clickeduserid,roomID], function(err, result){
              if (err) throw err;
              //return the room id to the user who requested
             //socket.join(roomID);
            // console.log('user '+ data.userid +' joined room '+roomID);
              //io.emit('previous chat',roomID);
              io.emit('re join',data);

            })
          }else{
            //result exist, fetch chat room and join user to it
            //console.log(result[0].roomID);
            socket.join(result[0].roomID);
            //console.log('user '+ data.userid +' joined room '+result[0].roomID);
            io.emit('previous chat', result[0])// sends just one
          }
        });
      });
      
     


    })

    socket.on('send_message', (message) => {
      console.log('message sent to '+message.roomID);
      console.log('message content '+JSON.stringify(message));
      socket.to(message.roomID).emit("received_message", message);
    });

    socket.on('save_messages',(data)=>{
      console.log('save messages')
      console.log(data)
    })
    console.log(io.sockets.adapter.rooms);

    //io.emit('serverEvent','I am talking back');

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      socket.broadcast.emit('saveMessages',socket.id)
      
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
})