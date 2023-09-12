import jwt from 'jsonwebtoken';
import config from './config.js';

const PRIVATE_KEY = config.privateKey
export const generateToken = (user, expiresIn='24h') => {
    
    
    const token = jwt.sign(user, PRIVATE_KEY, {expiresIn});
    return token;
}

export const authToken = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    
    if(!authHeader) return res.status(401).send({error: 'Not authenticated'});
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({error: 'Not authorized'});

        req.user = credentials.user;
        
        next();
    });
}