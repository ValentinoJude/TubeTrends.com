import config from './config.js';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

class YouTubeAPI {
    static getNextApiKey() {
        config.currentKeyIndex = (config.currentKeyIndex + 1) % config.YOUTUBE_API_KEYS.length;
        return config.YOUTUBE_API_KEYS[config.currentKeyIndex];
    }

    static getCurrentApiKey() {
        return config.YOUTUBE_API_KEYS[config.currentKeyIndex];
    }

    static async getChannelStats(channelId) {
        let attempts = 0;
        const maxAttempts = config.YOUTUBE_API_KEYS.length;

        while (attempts < maxAttempts) {
            try {
                const response = await fetch(
                    `${BASE_URL}/channels?part=statistics,snippet&id=${channelId}&key=${this.getCurrentApiKey()}`
                );
                
                if (response.status === 403) {
                    console.log(`API Key ${config.currentKeyIndex + 1} quota exceeded, trying next key...`);
                    this.getNextApiKey();
                    attempts++;
                    continue;
                }

                if (!response.ok) {
                    throw new Error(`YouTube API Error: ${response.status}`);
                }

                return await response.json();
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

    static async searchChannels(query) {
        let attempts = 0;
        const maxAttempts = config.YOUTUBE_API_KEYS.length;

        while (attempts < maxAttempts) {
            try {
                const encodedQuery = encodeURIComponent(query);
                const response = await fetch(
                    `${BASE_URL}/search?part=snippet&type=channel&maxResults=5&q=${encodedQuery}&key=${this.getCurrentApiKey()}`
                );

                if (response.status === 403) {
                    console.log(`API Key ${config.currentKeyIndex + 1} quota exceeded, trying next key...`);
                    this.getNextApiKey();
                    attempts++;
                    continue;
                }

                if (!response.ok) {
                    throw new Error(`YouTube API Error: ${response.status}`);
                }

                return await response.json();
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
}

export default YouTubeAPI; 