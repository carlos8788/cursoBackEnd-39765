import { generateToken } from '../config/config.jwt.js'
import { transport } from '../utils/mailer.js'
import { userService } from '../services/index.js'
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { createHash, isValidPassword } from '../utils.js';

const gitHubCallBack = (req, res) => {
    try {

        const user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            role: req.user.role,
            id: req.user.id,
            email: req.user.email,
            cart: req.user.carts
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
            email: req.user.email,
            cart: req.user.carts
        }

        const access_token = generateToken(user)

        return res.cookie('authToken', access_token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,

        }).sendSuccessUser({ userRole: user.role, email:user.email })
    } catch (error) {
        return res.sendInternalError(error);
    }

}

const registerPost = async (req, res) => {
    try {
        return res.sendSuccessUserCreate('User registered successfully')
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

const getMail = async (req, res) => {
    try {
        let result = await transport.sendMail({
            from: 'Luis ',
            to: 'carlos8788@gmail.com',
            subject: 'Correo de prueba',
            html: '<h1>HOLA MUNDO</h1>',
            attachments: []
        })

        res.sendSuccessWithPayload(result);
    } catch (error) {
        return res.sendInternalError(error);
    }
}

const restoreRequest = async (req, res) => {
    try {
        const { email } = req.body;
    if (!email) return res.sendBadRequest('No email provided');
    const user = await userService.getUsersByEmailService(email);
    if (!user) return res.sendBadRequest('invalid email');
    // const restoreToken = generateToken(user.toObject(), '1h');
    const restoreToken = jwt.sign(user.toObject(), config.secretKey, {expiresIn: '1h'});

    const html = `<div>
                    <h1>Restore Password</h1>
                    <p>You can reset your password <a href="http://localhost:8080/restorePassword?token=${restoreToken}">in this link</a></p>
                    </div>`
    const result = await transport.sendMail({
        from: 'BBM',
        to: user.email,
        subject: 'Restore Password',
        html: html,
        attachments: []
    })

    res.sendSuccess('send email')
    } catch (error) {
        res.sendInternalError(error)
    }
    
}

const restorePassword = async (req, res) => {
    const { password, passwordRepeat, token } = req.body;
    try {
        if (password !== passwordRepeat) return res.sendBadRequest('password is incorrect');

        const tokenUser = jwt.verify(token, config.secretKey);
        const user = await userService.getUsersByEmailService(tokenUser.email);

        const newHashedPassword = createHash(password)

        const isSamePassword = isValidPassword(user, password)
        if (isSamePassword) return res.sendBadRequest('Your password is the same');
        
        await userService.updatePasswordService(tokenUser.email, newHashedPassword);

        res.sendSuccess("Password Changed");
    } catch (error) {
        res.sendInternalError(error)
    }
}

export default {
    gitHubCallBack,
    loginPost,
    registerPost,
    postLogOut,
    currentSession,
    getMail,
    restoreRequest,
    restorePassword,
}