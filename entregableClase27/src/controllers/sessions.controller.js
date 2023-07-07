import { generateToken } from '../config/config.jwt.js'

const gitHubCallBack = (req, res) => {
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

}

const loginPost = async (req, res) => {
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

}

const registerPost = async (req, res) => {
    try {
        res.sendSuccess('User registered successfully')
    } catch (error) {
        return res.sendInternalError(error);
    }
}

const postLogOut = (req, res) => {

    try {
        return res.clearCookie('authToken').sendSuccess('logged out successfully')
    } catch (error) {
        return res.sendInternalError(error);
    }
}

const currentSession = (req, res) => {
    try {
        return res.sendSuccess(req.user);

    } catch (error) {
        return res.sendInternalError(error);
    }
}

export default {
    gitHubCallBack,
    loginPost,
    registerPost,
    postLogOut,
    currentSession,
}