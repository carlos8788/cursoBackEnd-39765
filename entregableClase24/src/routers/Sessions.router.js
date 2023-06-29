import BaseRouter from "./Router.js";
import { passportCall } from '../middleware/auth.js';
import { generateToken } from '../utils.jwt.js'

export default class SessionsRouter extends BaseRouter {
    init() {
        this.get('/github', ['GITHUB'], passportCall('github', { strategyType: "github" }), (req, res) => { });

        this.get('/githubcallback', ['GITHUB'], passportCall('github', { strategyType: "github" }), (req, res) => {
            try {

                const user = {
                    name: `${req.user.first_name} ${req.user.last_name}`,
                    role: req.user.role,
                    id: req.user.id,
                    email: req.user.email
                }

                const access_token = generateToken(user)
                
                return res.cookie('authToken', access_token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                    
                }).sendSuccessGitHub('Login successful')
            } catch (error) {
                return res.sendInternalError(error);
            }

        })

        this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: "locals" }), async (req, res) => {
            try {

                const user = {
                    name: `${req.user.first_name} ${req.user.last_name}`,
                    role: req.user.role,
                    id: req.user.id,
                    email: req.user.email
                }
                const access_token = generateToken(user)

                return res.cookie('authToken', access_token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                    
                }).sendSuccess('Login successful')
            } catch (error) {
                return res.sendInternalError(error);
            }

        })



        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: "locals" }), async (req, res) => {
            try {
                res.sendSuccess('User registered successfully')
            } catch (error) {
                return res.sendInternalError(error);
            }
        })


        this.get('/logout', ['AUTH'], (req, res) => {

            try {
                return res.clearCookie('authToken').sendSuccess('logged out successfully')
            } catch (error) {
                return res.sendInternalError(error);
            }
        })

        this.get('/current', ['AUTH'], passportCall('jwt', { strategyType: "locals" }), (req, res) => {
            try {
                return res.sendSuccess(req.user);

            } catch (error) {
                return res.sendInternalError(error);
            }
        });

    }

}