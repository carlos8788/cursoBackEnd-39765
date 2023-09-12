import mongoose from 'mongoose';
import config from './config.js';
import {getLogger} from '../middleware/logger.js';

const logger = getLogger()
const url = config.mongoUrl

const connectToDB = () => {
    try {
        mongoose.connect(url)
        logger.debug('connected to DB e-commerce')
    } catch (error) {
        logger.error(error);
        
    }
};

export default connectToDB

