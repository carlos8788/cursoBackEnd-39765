import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import socketProducts from './listeners/socketProducts.js';
import registerChatHandler from './listeners/chatHandlers.js';
import session from 'express-session'
import cookieParser from 'cookie-parser'
import mongoStore from 'connect-mongo'
import passport from 'passport';
import { initializePassport, initializePassportGitHub } from './config/passport.config.js';

import routerP from './routers/products.router.js';
import routerC from './routers/carts.router.js';
import routerV from './routers/views.router.js';
import routerS from './routers/session.router.js';

import __dirname from './utils.js';
import connectToDB from './config/configServer.js';



const app = express();
const PORT = process.env.PORT || 8080

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');


connectToDB()
initializePassport()
initializePassportGitHub()
app.use(session({
    store: mongoStore.create({
        ttl:3600,
        mongoUrl:'mongodb+srv://carlos8788:eN8xNDCYsEwjkaDL@e-commerce.nyingmg.mongodb.net/ecommerce?retryWrites=true&w=majority',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: 'secretCoder',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/session', routerS)
app.use('/api/products', routerP)
app.use('/api/carts', routerC)
app.use('/', routerV);


const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}\nAcceder a:`);
        console.log(`\t1). http://localhost:${PORT}/products`)
        console.log(`\t2). http://localhost:${PORT}/carts/646df484d31949d4081c72eb`);

    }   
    catch (err) {
        console.log(err);
    }
});

const io = new Server(httpServer)

socketProducts(io)

io.on('connection',socket=>{
    registerChatHandler(io,socket);
})