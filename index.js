const express = require("express");
const mongoose = require('mongoose');
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
const { createClient } = require('redis');
const cors = require("cors")

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_HOST, REDIS_PORT, SESSION_SECRET } = require('./config/config')

const mongoDbConnectionString = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
const redisConnectionString = `redis://default:password@${REDIS_HOST}:${REDIS_PORT}`

const connectWithRetry = () => {
    mongoose
        .connect(mongoDbConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(
            () => console.log("connected to db, motherF****d")
        ).catch(
            (e) => {
                console.log(e)
                setTimeout(connectWithRetry, 5000)
            }
        )
}

connectWithRetry()

const app = express();

app.get("/api/v1", (req, res) => {
    res.send("<h2>Hello There :-)</h2></br><h1>Generall Kenobi!!! How Nice of YOU!!</h1>")
    console.log("see me ran")
})

const redisClient = createClient({ legacyMode: true, url: redisConnectionString });
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});
redisClient.on('ready', function (err) {
    console.log('ready to use redis');
});
redisClient.connect()

// middleware

// enable controller responds as json
app.use(express.json())

//nginx
app.enable("trust proxy");

//cors
app.use(cors({}))


//redis
app.use(session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: SESSION_SECRET,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 //* 60
    }
}))


// localhost:3000/api/v1/posts
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));