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
import UserRouter from './routers/users.router.js';
import config from './config/config.js';

import { notFoundMiddleware } from './middleware/notfound.js';
import errorHandler from './middleware/errors/index.js';
import {attachLogger, getLogger} from './middleware/logger.js';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'

const logger = getLogger()

const app = express();
const PORT = config.port || 8080
const URL = config.url || 'http://localhost:'

app.use(express.json());
app.use(attachLogger)
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.cookieParserEnv));


app.engine('handlebars', handlebars.engine());


app.set('views', `${__dirname}/views`);
app.set('partials', `${__dirname}/views/partials`);
app.set('view engine', 'handlebars');


connectToDB();
initializePassport();


// SWAGGER
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info:{
            title:'Supermarket BBS',
            description: 'Documentation API'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

const ticketRouter = new TicketRouter();
const sessionsRouter = new SessionsRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const viewsRouter = new ViewsRouter();
const usersRouter = new UserRouter();

app.get('/logger', (req, res) => {

    req.logger.info(req.method)
    req.logger.error('FATAL ERROR')
    req.logger.fatal('LOGGER')
    req.logger.error('LOGGER')
    req.logger.warning('LOGGER')
    req.logger.http('LOGGER')
    req.logger.info('LOGGER')
    req.logger.debug('LOGGER')
    res.sendStatus(200)

})

app.use('/api/ticket', ticketRouter.getRouter())
app.use('/api/session', sessionsRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/', viewsRouter.getRouter());
app.use(notFoundMiddleware);


app.use(errorHandler);

app.listen(PORT, () => {
    try {
        logger.debug(`Listening to the port ${PORT}\nAcceder a:`);
        logger.debug(`\t1). ${URL}${PORT}/products`)
        logger.debug(`\t2). ${URL}${PORT}`);

    }
    catch (err) {
        logger.debug(err);
    }
});

