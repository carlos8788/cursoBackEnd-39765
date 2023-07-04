import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


// const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY = "JpvL8yCjZJjLCa5baNXtuk6DGrxxTZrRx9XBhUErl9U"

export const generateToken = (user) => {
    
    const token = jwt.sign(user, PRIVATE_KEY, {expiresIn:'24h'});
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