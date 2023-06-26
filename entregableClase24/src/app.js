import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import socketProducts from './listeners/socketProducts.js';
import registerChatHandler from './listeners/chatHandlers.js';
import cookieParser from 'cookie-parser'

import { initializePassport } from './config/passport.config.js';

// import routerP from './routers/products.router.js';
// import routerC from './routers/Carts.router.js';
import routerV from './routers/Views.router.js';


import __dirname from './utils.js';
import connectToDB from './config/configServer.js';
import SessionsRouter from './routers/Sessions.router.js';
import ProductsRouter from './routers/Products.router.js';
import CartsRouter from './routers/Carts.router.js';
import ViewsRouter from './routers/Views.router.js';



const app = express();
const PORT = process.env.PORT || 8080

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("cookieFirmadaCon88PlatosDePapaConQuesoMadeInArgNorte"));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');


connectToDB();
initializePassport();



// app.use(passport.initialize());
// app.use(passport.session());
const sessionsRouter = new SessionsRouter()
const productsRouter = new ProductsRouter()
const cartsRouter = new CartsRouter()
const viewsRouter = new ViewsRouter()

// app.use('/api/session', routerS);
app.use('/api/session',sessionsRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/', viewsRouter.getRouter());


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

const io = new Server(httpServer);

socketProducts(io);

io.on('connection',socket=>{
    registerChatHandler(io,socket);
});