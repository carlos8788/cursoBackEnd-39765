import { Router } from "express";
import TicketManager from "../DAO/mongo/managers/tickets.js";
import BaseRouter from "./Router.js";
import ticketControllers from "../controllers/tickets.controllers.js"
const router = new Router();

const ticket = new TicketManager();

router.get('/', async (req, res) => {
    const tickets = await ticket.getTickets()
    return res.send(tickets)
})

router.post('/', async (req, res) => {
    const ticketBody = req.body
    console.log(ticketBody);
    const tickets = await ticket.createTicket(ticketBody);
    return res.send(tickets)
});

// export default router

export default class TicketsRouter extends BaseRouter {
    init() {
        this.get('/', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), ticketControllers.getTicketByUserIdController())

        this.get('/:tid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }),  ticketControllers.getTicketByIdController())

        this.post('/', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), ticketControllers.postTicketController() )

        this.delete('/:tid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), ticketControllers.deleteTicketController() )

        this.put('/:tid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }),  ticketControllers.updateTicketController())
    }
}