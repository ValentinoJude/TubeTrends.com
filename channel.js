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
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=6&type=video&key=${config.YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        const videosContainer = document.getElementById('latest-videos');
        
        const videosHTML = data.items.map(video => `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${video.snippet.thumbnails.medium.url}" 
                         class="card-img-top" 
                         alt="${video.snippet.title}">
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${video.snippet.title}</h5>
                        <p class="card-text small text-muted">
                            ${new Date(video.snippet.publishedAt).toLocaleDateString()}
                        </p>
                        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" 
                           class="btn btn-danger btn-sm" 
                           target="_blank">
                            Watch Video
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
        videosContainer.innerHTML = videosHTML;
    } catch (error) {
        console.error('Error fetching latest videos:', error);
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
    initializeThemeToggle();
    updateActiveNavLink();
    
    // Add breadcrumb navigation
    const channelTitle = document.querySelector('#channel-title').textContent;
    document.querySelector('.container').insertAdjacentHTML('afterbegin', `
        <nav aria-label="breadcrumb" class="mt-3">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="leaderboard.html">Leaderboard</a></li>
                <li class="breadcrumb-item active" aria-current="page">${channelTitle || 'Channel Details'}</li>
            </ol>
        </nav>
    `);
    
    const urlParams = new URLSearchParams(window.location.search);
    const channelId = urlParams.get('id');
    
    if (channelId) {
        // Show loading state
        document.getElementById('channel-title').textContent = 'Loading...';
        
        await fetchChannelDetails(channelId);
    } else {
        console.error('No channel ID provided');
        // Optionally redirect back to leaderboard
        // window.location.href = 'leaderboard.html';
    }
});

async function fetchChannelDetails(channelId) {
    try {
        // Fetch basic channel info
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${config.YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        const channel = data.items[0];

        // Update breadcrumb with channel name
        document.getElementById('channel-breadcrumb').textContent = channel.snippet.title;

        // Update YouTube channel link
        document.getElementById('youtube-channel-link').href = `https://www.youtube.com/channel/${channelId}`;

        // Update UI with channel details
        document.getElementById('channel-thumbnail').src = channel.snippet.thumbnails.medium.url;
        document.getElementById('channel-title').textContent = channel.snippet.title;
        document.getElementById('channel-description').textContent = channel.snippet.description;
        document.getElementById('subscriber-count').textContent = formatNumber(parseInt(channel.statistics.subscriberCount));
        document.getElementById('view-count').textContent = formatNumber(parseInt(channel.statistics.viewCount));
        document.getElementById('video-count').textContent = formatNumber(parseInt(channel.statistics.videoCount));

        // Fetch latest videos
        await fetchLatestVideos(channelId);

        // Initialize charts
        initializeCharts();

    } catch (error) {
        console.error('Error fetching channel details:', error);
        document.getElementById('channel-title').textContent = 'Error loading channel';
    }
}

// Add more functions for fetching videos, creating charts, etc. 