import BaseRouter from "./Router.js";
import ticketControllers from "../controllers/users.controller.js"
import { passportCall } from '../middleware/auth.js';

export default class UserRouter extends BaseRouter {
    init() {
        this.post('/premium/:uid', ['AUTH', "USER", "PREMIUM"], passportCall('jwt', { strategyType: 'jwt' }), ticketControllers.changeUserRole)
    }
}