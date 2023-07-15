import { ticketsService } from "../services/index.js";


const getTickets = async (req, res) => {
    try {
        const tickets = await ticketsService.getTicketsService()
        return res.sendSuccess(tickets)

    } catch (error) {
        return res.sendInternalError(error)
    }
};

const getTicketById = async (req, res) => {
    const tid = req.params.tid
    try {
        const ticket = await ticketsService.getTicketByUserId(tid)
        return res.sendSuccess(ticket)

    } catch (error) {
        return res.sendInternalError(error)
    }
};

const getTicketByUserId = async (req, res) => {
    try {
        const uid = req.params.user._id
        const ticket = await ticketsService.getTicketByUserId(uid)
        return res.sendSuccess(ticket)

    } catch (error) {
        return res.sendInternalError(error)
    }
};

const postTicketService = async (req, res) => {
    try {
        const uid = req.params.user._id
        const ticketBody = req.body
        const ticket = await ticketsService.addTicketService(ticketBody);
        return res.sendSuccess(ticket)

    } catch (error) {
        return res.sendInternalError(error)
    }
};

const deleteTicketService = async (req, res) => {
    try {
        const tickets = await ticketsService.deleteTicketService(tid)
        return res.sendSuccess(tickets)

    } catch (error) {
        return res.sendInternalError(error)
    }
};

const updateTicketService = async (req, res) => {
    try {
        const tickets = await ticketsService.getTicketsService()
        return sendSuccess.send(tickets)

    } catch (error) {
        return res.sendInternalError(error)
    }
};