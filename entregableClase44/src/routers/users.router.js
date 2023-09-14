import BaseRouter from "./Router.js";
import userControllers from "../controllers/users.controller.js"
import { passportCall } from '../middleware/auth.js';
import upload from "../middleware/multerMiddleware.js";

export default class UserRouter extends BaseRouter {
    init() {
        this.post('/premium/:uid', ['AUTH', "USER", "PREMIUM"], passportCall('jwt', { strategyType: 'jwt' }), userControllers.changeUserRole)
        this.post('/:uid/documents', ['AUTH', "USER", "PREMIUM"], passportCall('jwt', { strategyType: 'jwt' }), upload.array('file', 10), userControllers.uploadHandler)
    }
}