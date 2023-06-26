import BaseRouter from "./Router.js";
import { passportCall } from "../utils.js";
import { generateToken } from '../utils.jwt.js'

export default class SessionsRouter extends BaseRouter {
    init() {
        this.get('/github', ['github'], passportCall('github', { strategyType: "github" }), (req, res) => { });

        this.get('/githubcallback', ['github'], passportCall('github', { strategyType: "github" }), (req, res) => {
            try {
                // const user = req.user;
                const user = {
                    name: `${req.user.first_name} ${req.user.last_name}`,
                    role: req.user.role,
                    id: req.user.id,
                    email: req.user.email
                }
                console.log(user);
                const access_token = generateToken(user)
                console.log('entro al return');
                return res.cookie('authToken', access_token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,

                }).sendSuccess('Login successful')
            } catch (error) {
                console.log(error);
            }

        })

        this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: "locals" }), async (req, res) => {
            try {
                console.log('login');
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
                console.log(error);
            }

        })



        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: "locals" }), async (req, res) => {
            try {
                res.send({ status: 'success', message: 'User registered successfully' })
            } catch (error) {
                console.log(error);
            }
        })



        this.get('/logout', ['PUBLIC'], async (req, res) => {

            try {
                // req.logout();
                return res.clearCookie('authToken').send('logged out successfully')
            } catch (error) {
                console.log(error, 'logout error acá');
            }
        })
    }
}