const axios = require('axios');

let lastPrices = null;
let lastFetchTime = null;

class CryptoService {
    static async getPrices() {
        const now = Date.now();

        if (lastPrices && lastFetchTime && now - lastFetchTime < 2 * 60 * 1000) {
            return lastPrices;
        }

        const url = 'https://api.coingecko.com/api/v3/simple/price';
        const params = {
            ids: 'bitcoin,ethereum,solana',
            vs_currencies: 'eur'
        };

        const response = await axios.get(url, { params });
        lastPrices = response.data;
        lastFetchTime = now;

        return lastPrices;
    }
}

module.exports = CryptoService;
