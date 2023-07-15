import { Router } from "express";
import TicketManager from "../DAO/mongo/managers/tickets.js";
import BaseRouter from "./Router.js";

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
        this.get('/', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), )

        this.get('/:tid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), )

        this.post('/', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), )

        this.delete('/:tid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), )

        this.put('/:tid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), )
    }
}