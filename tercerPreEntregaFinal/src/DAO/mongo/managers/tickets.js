import { ticketModel } from "../models/ticket.js";


class TicketManager {

    getTickets = async () => {
        try {
            return await ticketModel.find()
        } catch (err) {
            return err;
        }
    };

    getTicketsByUserId = async (idUser) => {
        try {
            return await ticketModel.find({ user: idUser})
        } catch (err) {
            return err;
        }
    };

    getTicketById = async (ticketId) => {
        try {

            return await ticketModel.findOne({ _id: ticketId }).lean()

        } catch (err) {
            return err;
        }

    }

    createTicket = async (ticket) => {      
        try {            
            
            return await ticketModel.create(ticket)

        }
        catch (err) {
            
            return err;

        }
    }

    deleteTicket = async (tid) => {
        try {
            return await ticketModel.deleteOne({ _id: tid })
        } catch (err) {
            return err
        }

    }

    updateTicket = async (id, ticket) => {
        try {
            return await ticketModel.findOneAndUpdate(id, { $set: ticket })
        } catch (err) {
            return err
        }
    }

};

export default TicketManager;


