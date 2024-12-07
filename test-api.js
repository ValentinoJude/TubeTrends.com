import config from './config.js';

// Test function to verify API connection
async function testYouTubeAPI() {
    try {
        // Test with a few popular channels
        const testChannels = [
            'UCX6OQ3DkcsbYNE6H8uQQuVA', // MrBeast
            'UCq-Fj5jknLsUf-MWSy4_brA', // T-Series
            'UC-lHJZR3Gqxm24_Vd_AJ5Yw'  // PewDiePie
        ];

        console.log('Starting API test...');
        
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${testChannels.join(',')}&key=${config.YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error.message}`);
        }

        const data = await response.json();
        console.log('API Test Successful! Sample data:', data.items[0].statistics);
        return true;
    } catch (error) {
        console.error('API Test Failed:', error.message);
        return false;
    }
}

// Run the test when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    const apiWorking = await testYouTubeAPI();
    if (apiWorking) {
        console.log('✅ YouTube API is working correctly!');
    } else {
        console.log('❌ YouTube API test failed. Check your API key and console for errors.');
    }
}); 