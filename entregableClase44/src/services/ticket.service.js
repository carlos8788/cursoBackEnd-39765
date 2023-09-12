export default class TicketService {
    constructor(dao){
        this.dao = dao;
    }
    getTicketsService = () => {
        return this.dao.getTickets();
    }
    getTicketByIdService = (TicketId) => {
        return this.dao.getTicketById(TicketId);
    }
    getTicketByUserId = (userId) => {
        return this.dao.getTicketsByUserId(userId)
    }
    addTicketService = (Ticket) => {
        return this.dao.createTicket(Ticket)
    }
    deleteTicketService = (tid) => {
        return this.dao.deleteTicket(tid)
    }
    updateTicketService = (tid) => {
        return this.dao.updateTicket(tid)
    }

}