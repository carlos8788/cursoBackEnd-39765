import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import socketProducts from './listeners/socketProducts.js';
import registerChatHandler from './listeners/chatHandlers.js';

import routerP from './routers/products.router.js';
import routerC from './routers/carts.router.js';
import routerV from './routers/views.router.js';

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


app.use('/api/products', routerP)
app.use('/api/carts', routerC)
app.use('/', routerV);

connectToDB()

const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}\nAcceder a:`);
        console.log(`\t1). http://localhost:${PORT}/`)
        console.log(`\t2). http://localhost:${PORT}/realtimeproducts`);
        console.log(`\t3). http://localhost:${PORT}/chat`);
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