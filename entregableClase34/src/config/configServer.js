import mongoose from 'mongoose';
import config from './config.js';
import LoggerService from '../services/logger.service.js';

const url = config.mongoUrl

const loggerService = new LoggerService(config.enviroment);
const {logger} = loggerService

const connectToDB = () => {
    try {
        mongoose.connect(url)
        logger.debug('connected to DB e-commerce')
    } catch (error) {
        logger.error(error);
        
    }
};

export default connectToDB

