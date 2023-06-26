import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const passportCall = (strategy,options={}) =>{
    console.log(strategy, options.strategyType, 'estratehia');
    return async(req,res,next) =>{
        // if(strategy === 'AUTH') return next();
        passport.authenticate(strategy,(error,user,info)=>{
            if(error) return next(error);
            if(!options.strategyType){
                console.log(`Route ${req.url} doesn't have defined a strategyType`);
                return res.sendInternalError(`Route ${req.url} doesn't have defined a strategyType`);
            }

            if(!user) {
                //¿Qué significa el que no haya encontrado user en cada caso?
                switch(options.strategyType) {
                    case 'jwt':
                        console.log('jwt');
                        req.error = info.message?info.message:info.toString();
                        return next();
                    case 'locals':
                        return res.sendUnauthorized(info.message?info.message:info.toString())
                    case 'github':
                        console.log('github');
                        return next();
                    
                }
            }

            req.user = user;
            next();
        })(req,res,next);
    }
}

export const cookieExtractor = (req) =>{
    let token = null; 

    if(req&&req.cookies) {
        token = req.cookies['authToken']
    }
    return token;
}


export default __dirname;