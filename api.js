// API configuration and authentication
const API_KEY = 'YOUR_YOUTUBE_API_KEY';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

class YouTubeAPI {
    static async getChannelStats(channelId) {
        const response = await fetch(
            `${BASE_URL}/channels?part=statistics,snippet&id=${channelId}&key=${API_KEY}`
        );
        return await response.json();
    }

    static async getHistoricalData(channelId) {
        // This would need a backend service to store historical data
        const response = await fetch(`/api/historical/${channelId}`);
        return await response.json();
    }
} 