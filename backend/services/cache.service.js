const NodeCache = require('node-cache');

class CacheService {
    constructor() {
        this.cache = new NodeCache({
            stdTTL : 300,
            checkperiod : 60,
            useClones : false
        });

        this.stats = {
            hits : 0,
            misses : 0
        };
    }

    // Get data from cache
    get(key) {
        const value = this.cache.get(key);

        if(value !== undefined) {
            this.stats.hits++;
            return { hit: true, data: value };
        }

        this.stats.misses++;
        return { hit: false, data: null };
    }

    // Set data in cache
    set(key, value, ttl = 300){
        return this.cache.set(key, value, ttl);
    }

    // Get cache statistics
    getStats() {
        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            hitsRate: this.stats.hits + this.stats.misses > 0 
               ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2) + '%'
                : '0%',
            keys: this.cache.keys(),
            keysCount: this.cache.keys().length,
            internalStats: this.cache.getStats()
        };
    }

    // Clear the cache
    flush() {
        this.cache.flushAll();
        this.stats = { hits: 0, misses: 0 };    
    }
}

module.exports = new CacheService();