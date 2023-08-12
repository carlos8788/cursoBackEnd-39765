import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2'

import { createHash, isValidPassword } from '../utils.js';
import { cookieExtractor } from '../middleware/auth.js'

import { Strategy, ExtractJwt } from 'passport-jwt';
import { usersService } from '../DAO/mongo/managers/index.js';
import { cartService } from '../services/index.js';
import config from './config.js';

import UserDTO from '../DTOs/user/userDTO.js';

import CustomError from '../services/errors/customErrors.js'
import EErrors from '../services/errors/enums.js';
import { generateUserErrorInfo } from '../services/errors/constant.js';

const localStrategy = local.Strategy

export const initializePassport = () => {
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, emailUser, password, done) => {
            try {
                const { first_name, last_name, email, age } = req.body;
                if (!first_name || !last_name || !email || !age) {

                    CustomError.createError({
                        name:'User creation failed',
                        cause: generateUserErrorInfo({first_name, last_name, email, age}),
                        message:"Error trying to create User",
                        code: EErrors.INVALID_TYPES_ERROR
                    })
                    
                }
                
                const user = await usersService.getUsersByEmail(emailUser)
                
                if (user) {
                    
                    return done(null, false, { message: 'User already exists' });
                }
                
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                }


                const checkUser = Object.values(newUser).every(property => property)
                if (!checkUser) return done({ status: 'error', message: 'User Incomplete' })

                const result = await usersService.createUser(newUser);

                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }
    ))

    passport.use(
        'login',
        new localStrategy(
            { usernameField: 'email' },

            async (email, password, done) => {
                let resultUser;
                try {
                    if (email === config.adminName && password === config.adminPassword) {
                        resultUser = new UserDTO(
                            {
                                first_name: 'admin',
                                last_name: 'coder',
                                email: 'adminCoder@coder.com',
                                age: 100,

                                role: 'ADMIN'
                            }
                        )
                        return done(null, resultUser);

                    }
                    const userDB = await usersService.validateUser(email)


                    if (!userDB) return done(null, false, { status: 'error', message: 'User not found, please try again or password not valid' })

                    if (!isValidPassword(userDB, password)) return done(null, false, { status: 'error', message: 'password not valid' })

                    delete userDB.password
                    let existsCart = await cartService.getCartsByUserService(userDB._id)

                    async function handleCart() {
                        let newUserCart;
                        if (existsCart.length === 0) {
                            existsCart = await cartService.addCartService({ userId: userDB._id, products: [] });
                            let newCart = await usersService.addCart({ userId: userDB._id, cartId: existsCart._id });

                            newUserCart = newCart.carts[0];
                        }

                        return newUserCart;
                    }


                    let cart = existsCart[0] ? existsCart[0]._id : await handleCart();



                    const user = new UserDTO(
                        {
                            id: userDB._id,
                            first_name: userDB.first_name,
                            last_name: userDB.last_name,
                            email: userDB.email,
                            role: userDB.role,
                            cart
                        })




                    return done(null, user, { status: 'success', message: 'User log' })
                } catch (error) {
                    return done(error)
                }


            }
        )
    );

    passport.use('github', new GitHubStrategy({
        clientID: config.gitHubClientId,
        clientSecret: config.gitHubClientSecret,
        callbackURL: config.callbackURL


    }, async (accessToken, refreshToken, profile, done) => {
        try {

            let emailGitHub = `${profile._json.login}@github.com`
            let user = await usersService.getUsersByEmail(emailGitHub);


            if (!user) {

                let userGitHub = new UserDTO(
                    {
                        first_name: profile._json.login,
                        last_name: profile._json.node_id,
                        email: emailGitHub,
                        password: '',

                    }
                )
                const result = await usersService.createUser(userGitHub);
                let existsCart = await cartService.getCartsByUserService(result._id)

                if (existsCart.length === 0) {
                    let newCart = await cartService.addCartService({ userId: result._id, products: [] })
                    const addCartUser = await usersService.addCart({ userId: result._id, cartId: newCart._id })

                    return done(null, addCartUser);
                }

                return done(null, result);
            }
            else {
                done(null, user);
            }

        } catch (error) {
            return done(error);
        }
    }
    ))

    passport.use('jwt', new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.privateKey, // CAMBIAR LUEGO

        }, async (payload, done) => {
            try {

                return done(null, payload);
            } catch (error) {
                return done(error)
            }
        }
    ))
}





export default {
    initializePassport,

};