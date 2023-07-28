import passport from "passport";

export const passportCall = (strategy,options={}) =>{
    
    return async(req,res,next) =>{
        
        passport.authenticate(strategy,(error,user,info)=>{
            if(error) return next(error);
            if(!options.strategyType){
                console.log(`Route ${req.url} doesn't have defined a strategyType`);
                return res.sendInternalError(`Route ${req.url} doesn't have defined a strategyType`);
            }

            if(!user) {
                
                switch(options.strategyType) {
                    case 'jwt':
                        req.error = info.message?info.message:info.toString();
                        return next();
                    case 'locals':
                        return res.sendUnauthorized(info.message?info.message:info.toString())
                    case 'login':
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