import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { db } from '../api/connect.js';

const PORT = process.env.PORT || 5500;
const app = express();

class Notification {
    constructor(sendID, receiverID, type) {
        this.sendID = sendID;
        this.receiverID = receiverID;
        this.type = type;
    };

    static notifSave() {
        q = `INSERT INTO notifications (sendID, receiverID, type) VALUES ${this.sendID, this.receiverID, this.type}`;
        db.query(q, function (error) {
            if (error) throw error;
            console.log('inserted into query');
        });
    };
};

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('Socket connecteed!');

    socket.on('comment', (data) => {
        console.log(data);

    });

    socket.on('liked', (socketData) => {
        console.log('Someone liked your post :$');
        const q = "SELECT name FROM users WHERE id = ?";
        const notiText = '';
        db.query(q, [socketData.senderId], function (error, resp) {
            if (error) console.log('ERROR: --------------');
            // console.log(JSON.stringify(data[0]['name']));
            const name = JSON.stringify(resp[0]['name']);
            const notiText = `${name} said yes to your post!`;
            const oq = "SELECT userid FROM posts WHERE id = ?";
            socket.emit('sendNotification', {
                notiText: notiText,
                senderId: socketData.senderId,
                authorid: socketData.authorid
            });
            //const myNotif = new Notification(socketData.senderId, socketData.authorid, 'said yes to your post!');
            //myNotif.notifSave();
        })
    });
})

server.listen(PORT, (error) => {
    if (error) console.log(error);
    console.log('Socket running!');
});

export default io;