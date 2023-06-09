import messageModel from "../models/message.js";

export default class MessagesManager {

    getMessages = (params) => {
        try {
            return messageModel.find(params).lean();

        } catch (error) {
            return error
        }
    }

    createMessage = (message) => {
        try {

            return messageModel.create(message);
        } catch (error) {
            return error
        }
    }
}