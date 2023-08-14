import BaseRouter from "./Router.js";
import ticketControllers from "../controllers/tickets.controllers.js"
import { passportCall } from '../middleware/auth.js';

export default class TicketsRouter extends BaseRouter {
    init() {
        this.get('/', ['AUTH', "USER"], passportCall('jwt', { strategyType: 'jwt' }), ticketControllers.getTicketByUserIdController)

        this.get('/:tid', ['AUTH', "USER"], passportCall('jwt', { strategyType: 'jwt' }), ticketControllers.getTicketByIdController)

        this.post('/', ['AUTH', "USER"], passportCall('jwt', { strategyType: 'jwt' }), ticketControllers.postTicketController)

        this.delete('/:tid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), ticketControllers.deleteTicketController)

        this.put('/:tid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), ticketControllers.updateTicketController)
    }
}