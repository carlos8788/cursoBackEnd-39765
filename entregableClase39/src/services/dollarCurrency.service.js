import get from 'axios';
import config from '../config/config.js';

import { getLogger } from '../middleware/logger.js';
const logger = getLogger()

const CURRENCYLAYER_ENDPOINT = 'http://api.currencylayer.com/live';


export async function getDollarRate() {
    if (!config.keyCurrentcyLayer) return logger.error('Key not available');

    try {
        const response = await get(CURRENCYLAYER_ENDPOINT, {
            params: {
                access_key: config.keyCurrentcyLayer
            }
        });
        

        if (response.data && response.data.quotes && response.data.quotes.USDCOP) {
            return response.data.quotes.USDARS;
        } else if (response.data && response.data.error) {
            logger.error('Error al obtener la cotización del dolar: ' + response.data.error.info);
            throw new Error(response.data.error.info);
        } else {
            throw new Error("No se pudo obtener la cotización del dolar");
        }
    } catch (error) {
        logger.error('Error al obtener la cotización del dolar: ' + error.message);
        throw error;
    }
}
