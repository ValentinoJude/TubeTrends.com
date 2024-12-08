// API configuration and authentication
class YouTubeAPI {
    // Add your restricted API keys
    static API_KEYS = [
        'AIzaSyBjyN7qiVLYZKmXcZmkTZPWw4b-5bYwRC8',
        'AIzaSyD8m05Gx3C4z_Urr5zQm199xtDxZM1LN2w',
        'AIzaSyBnkozJzZZWGPwvk4C5RF3nSY64-Yh1u-g'
    ];
    
    static currentKeyIndex = 0;
    static BASE_URL = 'https://www.googleapis.com/youtube/v3';

    static getNextApiKey() {
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.API_KEYS.length;
        return this.API_KEYS[this.currentKeyIndex];
    }

    static getCurrentApiKey() {
        return this.API_KEYS[this.currentKeyIndex];
    }

    static async searchChannels(query) {
        let attempts = 0;
        const maxAttempts = this.API_KEYS.length;

        while (attempts < maxAttempts) {
            try {
                const encodedQuery = encodeURIComponent(query);
                const url = `${this.BASE_URL}/search?part=snippet&type=channel&maxResults=5&q=${encodedQuery}&key=${this.getCurrentApiKey()}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (response.status === 403 && data.error && data.error.errors) {
                    const quotaError = data.error.errors.find(e => e.reason === 'quotaExceeded');
                    if (quotaError) {
                        console.log(`API Key ${this.currentKeyIndex + 1} quota exceeded, trying next key...`);
                        this.getNextApiKey();
                        attempts++;
                        continue;
                    }
                }
                
                if (!response.ok) {
                    throw new Error(`YouTube API Error: ${response.status}`);
                }
                
                return data;
            } catch (error) {
                attempts++;
                if (attempts === maxAttempts) {
                    console.error('All API keys have exceeded their quota');
                    throw new Error('All API keys quota exceeded');
                }
                this.getNextApiKey();
            }
        }
    }

    static async getChannelStats(channelId) {
        let attempts = 0;
        const maxAttempts = this.API_KEYS.length;

        while (attempts < maxAttempts) {
            try {
                const url = `${this.BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${this.getCurrentApiKey()}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (response.status === 403 && data.error && data.error.errors) {
                    const quotaError = data.error.errors.find(e => e.reason === 'quotaExceeded');
                    if (quotaError) {
                        console.log(`API Key ${this.currentKeyIndex + 1} quota exceeded, trying next key...`);
                        this.getNextApiKey();
                        attempts++;
                        continue;
                    }
                }
                
                if (!response.ok) {
                    throw new Error(`YouTube API Error: ${response.status}`);
                }
                
                return data;
            } catch (error) {
                attempts++;
                if (attempts === maxAttempts) {
                    console.error('All API keys have exceeded their quota');
                    throw new Error('All API keys quota exceeded');
                }
                this.getNextApiKey();
            }
        }
    }

    static async getHistoricalData(channelId) {
        // This would need a backend service to store historical data
        const response = await fetch(`/api/historical/${channelId}`);
        return await response.json();
    }
} 