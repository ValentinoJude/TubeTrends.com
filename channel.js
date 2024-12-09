import config from './config.js';

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcons(savedTheme === 'dark');

    // Add console log for debugging
    console.log('Current theme:', savedTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = body.getAttribute('data-bs-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        body.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(!isDark);
        
        // Add console log for debugging
        console.log('Theme switched to:', newTheme);
    });
}

function updateThemeIcons(isDark) {
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    
    if (lightIcon && darkIcon) {
        lightIcon.style.display = isDark ? 'none' : 'inline-block';
        darkIcon.style.display = isDark ? 'inline-block' : 'none';
    }
}

// Utility function for number formatting
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Fetch and display latest videos
async function fetchLatestVideos(channelId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=2&type=video&key=${config.YOUTUBE_API_KEYS[config.currentKeyIndex]}`
        );
        const data = await response.json();
        const videosContainer = document.getElementById('latest-videos');
        
        const videosHTML = data.items.map(video => `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <img src="${video.snippet.thumbnails.medium.url}" 
                         class="card-img-top" 
                         alt="${video.snippet.title}"
                         style="object-fit: cover; height: 200px;">
                    <div class="card-body">
                        <h5 class="card-title" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${video.snippet.title}
                        </h5>
                        <p class="card-text small text-muted">
                            Published: ${new Date(video.snippet.publishedAt).toLocaleDateString()}
                        </p>
                        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" 
                           class="btn btn-danger" 
                           target="_blank">
                            <i class="fab fa-youtube me-2"></i>Watch Video
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
        videosContainer.innerHTML = videosHTML;
    } catch (error) {
        console.error('Error fetching latest videos:', error);
        document.getElementById('latest-videos').innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Unable to load latest videos. Please try again later.
                </div>
            </div>
        `;
    }
}

// Initialize charts
function initializeCharts() {
    try {
        // Revenue Chart
        const revenueCanvas = document.getElementById('revenue-chart');
        if (!revenueCanvas) {
            console.error('Revenue chart canvas not found');
            return;
        }
        const revenueCtx = revenueCanvas.getContext('2d');
        
        // Add canvas element dynamically
        revenueCanvas.innerHTML = '<canvas></canvas>';
        
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Estimated Revenue (USD)',
                    data: generateRevenueData(),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Estimated Revenue'
                    }
                }
            }
        });

        // Growth Chart
        const growthCanvas = document.getElementById('growth-chart');
        if (!growthCanvas) {
            console.error('Growth chart canvas not found');
            return;
        }
        const growthCtx = growthCanvas.getContext('2d');
        
        // Add canvas element dynamically
        growthCanvas.innerHTML = '<canvas></canvas>';
        
        new Chart(growthCtx, {
            type: 'bar',
            data: {
                labels: ['Subscribers', 'Views', 'Videos'],
                datasets: [{
                    label: 'Growth Rate (%)',
                    data: [12, 15, 8],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(75, 192, 192)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Growth Rate'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Helper function to generate sample revenue data
function generateRevenueData() {
    // This is a simplified estimation based on views
    const viewCount = parseInt(document.getElementById('view-count').textContent.replace(/[KMB]/g, ''));
    const baseRevenue = viewCount * 0.001; // Rough estimate of $1 per 1000 views
    
    // Generate 6 months of data with some variation
    return Array.from({length: 6}, () => {
        return baseRevenue * (0.8 + Math.random() * 0.4);
    });
}

// Add this function to handle active nav states
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === 'leaderboard.html') {
            link.classList.add('active');
        }
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Page loaded, getting channel ID...');
        const urlParams = new URLSearchParams(window.location.search);
        const channelId = urlParams.get('id');
        
        if (!channelId) {
            console.error('No channel ID provided');
            return;
        }

        console.log('Fetching details for channel:', channelId);
        const channelData = await fetchChannelDetails(channelId);
        
        if (channelData) {
            console.log('Updating UI with channel data:', channelData);
            
            // Update basic info
            document.getElementById('channel-title').textContent = channelData.snippet.title;
            document.getElementById('channel-description').textContent = channelData.snippet.description;
            
            // Update breadcrumb and channel link
            document.getElementById('channel-breadcrumb').textContent = channelData.snippet.title;
            document.getElementById('youtube-channel-link').href = `https://www.youtube.com/channel/${channelId}`;
            
            // Update thumbnail
            const thumbnail = document.getElementById('channel-thumbnail');
            thumbnail.src = channelData.snippet.thumbnails.default.url;
            thumbnail.alt = channelData.snippet.title;
            
            // Update statistics with formatting
            document.getElementById('subscriber-count').textContent = 
                formatNumber(parseInt(channelData.statistics.subscriberCount));
            document.getElementById('view-count').textContent = 
                formatNumber(parseInt(channelData.statistics.viewCount));
            document.getElementById('video-count').textContent = 
                formatNumber(parseInt(channelData.statistics.videoCount));

            // Initialize charts
            initializeCharts(channelData);
            
            // Fetch latest videos
            await fetchLatestVideos(channelId);

            console.log('UI update complete');
        }
    } catch (error) {
        console.error('Error updating UI:', error);
        // Show error state
        document.getElementById('channel-title').textContent = 'Error loading channel';
        document.getElementById('channel-description').textContent = 'Failed to load channel details. Please try again later.';
    }
});

async function fetchChannelDetails(channelId) {
    try {
        let attempts = 0;
        const maxAttempts = config.YOUTUBE_API_KEYS.length;

        while (attempts < maxAttempts) {
            try {
                console.log(`Attempting to fetch channel details with key ${attempts + 1}...`);
                console.log('Current API Key:', config.YOUTUBE_API_KEYS[config.currentKeyIndex]);
                
                const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${config.YOUTUBE_API_KEYS[config.currentKeyIndex]}`;
                console.log('Request URL:', url);

                const response = await fetch(url);
                const data = await response.json();

                // Log the actual response
                console.log('API Response:', data);

                if (response.status === 403) {
                    console.log(`API Key ${config.currentKeyIndex + 1} quota exceeded, trying next key...`);
                    config.currentKeyIndex = (config.currentKeyIndex + 1) % config.YOUTUBE_API_KEYS.length;
                    attempts++;
                    continue;
                }

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}: ${data.error?.message || 'Unknown error'}`);
                }

                if (!data.items || data.items.length === 0) {
                    throw new Error('Channel not found');
                }

                // If we get here, we have valid data
                console.log('Successfully fetched channel details:', data.items[0]);
                return data.items[0];

            } catch (error) {
                console.error(`Attempt ${attempts + 1} failed:`, error);
                attempts++;
                if (attempts === maxAttempts) {
                    console.error('All API keys have been tried and failed');
                    throw error;
                }
                config.currentKeyIndex = (config.currentKeyIndex + 1) % config.YOUTUBE_API_KEYS.length;
            }
        }
    } catch (error) {
        console.error('Error in fetchChannelDetails:', error);
        // Add user-friendly error display
        document.getElementById('channel-title').textContent = 'Error loading channel';
        document.getElementById('channel-description').textContent = 'Failed to load channel details. Please try again later.';
        throw error;
    }
}

// Add more functions for fetching videos, creating charts, etc. 