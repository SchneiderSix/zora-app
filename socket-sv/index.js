import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import session from 'express-session';

const PORT = process.env.PORT || 5500;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const sessionMiddleware = session({
    secret: 'dontseepls',
    resave: false,
    saveUninitialized: false
});

app.use(sessionMiddleware);

export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

app.post('/authSocket', (req, res) => {
    req.session.authenticated = true;
    res.status(204).end();
})

io.use(wrap(sessionMiddleware));

io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.authenticated) {
        console.log('Already in session!');
        next();
    } else {
        console.log('not in session >:v');
        // next(new Error("unauthorized"));
    }
});

io.on('connection', (socket) => {
    const sessionID = socket.request.session.id;
    socket.join(sessionID);
    console.log(`Socket running with id: ${socket.id}`);

    socket.on('this a test', (data) => {
        console.log(data);
    })

    socket.on('makepost', (data) => {
        console.log(data);
    })

    socket.on('disconnect', () => {
        console.log('Socket disconnected :(')
    });
})

server.listen(PORT, (error) => {
    if (error) console.log(error);
    console.log('Socket running!');
});

export default io;