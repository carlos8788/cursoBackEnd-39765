import express from 'express';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser'

import { initializePassport } from './config/passport.config.js';

import { __dirname } from './utils.js';
import connectToDB from './config/configServer.js';
import SessionsRouter from './routers/Sessions.router.js';
import ProductsRouter from './routers/Products.router.js';
import CartsRouter from './routers/Carts.router.js';
import ViewsRouter from './routers/Views.router.js';
import TicketRouter from './routers/Ticket.router.js';

import config from './config/config.js';

const app = express();
const PORT = config.port || 8080
const URL = config.url || 'http://localhost:'

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.cookieParserEnv));





app.engine('handlebars', handlebars.engine());


app.set('views', `${__dirname}/views`);
app.set('partials', `${__dirname}/views/partials`);
app.set('view engine', 'handlebars');


connectToDB();
initializePassport();

const ticketRouter = new TicketRouter();
const sessionsRouter = new SessionsRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const viewsRouter = new ViewsRouter();


app.use('/api/ticket', ticketRouter.getRouter())
app.use('/api/session', sessionsRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/', viewsRouter.getRouter());


app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}\nAcceder a:`);
        console.log(`\t1). ${URL}${PORT}/products`)
        console.log(`\t2). ${URL}${PORT}`);

    }
    catch (err) {
        console.log(err);
    }
});
