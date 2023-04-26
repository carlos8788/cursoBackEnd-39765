import express from 'express';
import routerP from './routers/products.router.js';
import routerC from './routers/carts.router.js';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import routerV from './routers/views.router.js';
import { Server } from 'socket.io';
import socketProducts from './utils.socket.js';

const app = express();
const PORT = 8080

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');


app.use('/api/products', routerP)
app.use('/api/carts', routerC)
app.use('/', routerV);

const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}`);
        console.log("http://localhost:8080/")
        console.log("http://localhost:8080/realtimeproducts");
    }
    catch (err) {
        console.log(err);
    }
});

const socketServer = new Server(httpServer)

socketProducts(socketServer)