import nodemailer from 'nodemailer';
import config from '../config/config.js';
export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user:config.user_mail,
        pass:config.pass_mail
    }
})