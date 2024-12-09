import YouTubeAPI from './api.js';  // Import the class, not API_KEY

const TOP_CREATORS = [
    'UCX6OQ3DkcsbYNE6H8uQQuVA',    // MrBeast
    'UCq-Fj5jknLsUf-MWSy4_brA',     // T-Series
    'UCbCmjCuTUZos6Inko4u57UQ',     // Cocomelon
    'UCpEhnqL0y41EpW2TvWAHD7Q',     // SET India
    'UC-lHJZR3Gqxm24_Vd_AJ5Yw'      // PewDiePie
];

async function fetchCreatorData() {
    const container = document.querySelector('#creator-container');
    if (!container) {
        console.error('Creator container not found');
        return;
    }

    // Show loading state
    container.innerHTML = `
        <div class="text-center w-100">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

    try {
        const creatorData = [];
        console.log('Fetching creator data...'); // Debug log
        
        for (const channelId of TOP_CREATORS) {
            console.log(`Fetching data for channel: ${channelId}`); // Debug log
            const data = await YouTubeAPI.getChannelStats(channelId);
            console.log('Received data:', data); // Debug log
            if (data && data.items && data.items[0]) {
                creatorData.push(data.items[0]);
            }
        }

        console.log('All creator data:', creatorData); // Debug log
        updateCreatorCards(creatorData);
    } catch (error) {
        console.error('Error fetching creator data:', error);
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error loading creator data. Please try again later.
            </div>
        `;
    }
}

function formatNumber(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B';
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M';
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K';
    }
    return num;
}

function updateCreatorCards(creators) {
    console.log('Updating creator cards with:', creators); // Debug log
    const container = document.querySelector('#creator-container');
    if (!container) {
        console.error('Container not found');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create HTML for each creator
    creators.forEach((creator, index) => {
        const stats = creator.statistics;
        const html = `
            <div class="col-md-${index < 3 ? '4' : '6'}">
                <div class="card h-100 creator-card">
                    <img src="${creator.snippet.thumbnails.high.url}" class="card-img-top creator-img" alt="${creator.snippet.title}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${creator.snippet.title}</h5>
                            <span class="badge bg-danger">#${index + 1}</span>
                        </div>
                        <p class="card-text">
                            <i class="fas fa-users me-2"></i>${formatNumber(stats.subscriberCount)} Subscribers<br>
                            <i class="fas fa-eye me-2"></i>${formatNumber(stats.viewCount)} Views
                        </p>
                        <a href="https://www.youtube.com/channel/${creator.id}" class="btn btn-outline-danger" target="_blank">View Channel</a>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// Initial fetch
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, fetching creator data...'); // Debug log
    fetchCreatorData();
});

// Update every 5 minutes
setInterval(fetchCreatorData, 300000);