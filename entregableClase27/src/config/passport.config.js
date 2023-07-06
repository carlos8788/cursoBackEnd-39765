import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2'

import { createHash, isValidPassword } from '../utils.js';
import { cookieExtractor } from '../middleware/auth.js'

import { Strategy, ExtractJwt } from 'passport-jwt';
import { usersService } from '../DAO/mongo/managers/index.js';
import config from './config.js';

const localStrategy = local.Strategy


export const initializePassport = () => {
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, emailUser, password, done) => {
            const { first_name, last_name, email, age } = req.body;

            try {
                const user = await usersService.getUsersByEmail(emailUser)
                // let user = await userManager.getUsersByEmail(username);
                if (user) {
                    
                    return done(null, false, { message: 'User already exists' });
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }

                const checkUser = Object.values(newUser).every(property => property)
                if (!checkUser) return res.send({ status: 'error', message: 'User Incomplete' })

                const result = await usersService.createUser(newUser);
                // result.access_token = generateToken(result)  
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
                        resultUser = {
                            first_name: 'admin',
                            last_name: 'coder',
                            email: 'adminCoder@coder.com',
                            age: 100,

                            role: 'admin'
                        }
                        return done(null, resultUser);

                    }

                    const userDB = await usersService.validateUser(email)


                    if (!userDB) return done(null, false, { status: 'error', message: 'User not found, please try again or password not valid' })

                    if (!isValidPassword(userDB, password)) return done(null, false, { status: 'error', message: 'password not valid' })
                    
                    delete userDB.password

                    const user = {
                        id: userDB._id,
                        first_name: userDB.first_name,
                        last_name: userDB.last_name,
                        email: userDB.email,
                        role: userDB.role
                    }

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
                let userGitHub = {
                    first_name: profile._json.login,
                    last_name: profile._json.node_id,
                    email: emailGitHub,
                    age: 20,
                    password: ''
                }
                const result = await usersService.createUser(userGitHub);
                
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
            secretOrKey:config.privateKey, // CAMBIAR LUEGO
    
        }, async(payload, done) => {
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