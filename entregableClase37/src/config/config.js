import dotenv from 'dotenv';

dotenv.config();

// const config = 

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    privateKey: process.env.PRIVATE_KEY,
    secretKey: process.env.SECRET_KEY,
    gitHubClientId: process.env.GITHUB_CLIENT_ID,
    gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    url: process.env.URL_HOST,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    cookieParserEnv: process.env.COOKIE_PARSER,
    user_mail: process.env.USER_MAIL,
    pass_mail: process.env.PASS_MAIL,
    enviroment: process.env.ENV
}
