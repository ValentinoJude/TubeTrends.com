document.addEventListener('DOMContentLoaded', function() {
    // Get filter elements
    const categorySelect = document.getElementById('category-select');
    const growthPeriod = document.getElementById('time-select');
    const sortBy = document.getElementById('sort-select');
    const searchInput = document.querySelector('input[type="text"]');
    const searchButton = document.querySelector('.btn-danger');
    
    // Add event listeners with null checks
    if (categorySelect) {
        categorySelect.addEventListener('change', updateCreators);
    }
    
    if (growthPeriod) {
        growthPeriod.addEventListener('change', updateCreators);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', updateCreators);
    }
    
    // Add search functionality
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(updateCreators, 300);
    });
    
    searchButton.addEventListener('click', () => {
        updateCreators();
    });
    
    function updateCreators() {
        // Get current filter values
        const category = categorySelect?.value || 'all';
        const period = growthPeriod?.value || '30days';
        const sortMethod = sortBy?.value || 'subscribers';
        
        // Update URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('category', category);
        searchParams.set('period', period);
        searchParams.set('sort', sortMethod);
        
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        history.pushState({}, '', newUrl);
        
        // Here you would typically make an API call to get filtered/sorted data
        console.log('Filters:', { category, period, sortMethod });
    }
}); 

function showLoading() {
    const leaderboard = document.querySelector('.list-group');
    leaderboard.innerHTML = `
        <div class="list-group-item p-5 text-center">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
} 

// Add this button to your HTML first
const exportButton = document.createElement('button');
exportButton.className = 'btn btn-outline-danger ms-2';
exportButton.innerHTML = '<i class="fas fa-download me-2"></i>Export Data';
exportButton.onclick = exportLeaderboard;
document.querySelector('.card-body .row').appendChild(exportButton);

function exportLeaderboard() {
    const data = getCurrentLeaderboardData();
    const csv = convertToCSV(data);
    downloadCSV(csv, 'youtube_leaderboard.csv');
}

function convertToCSV(data) {
    const headers = ['Rank', 'Channel', 'Subscribers', 'Videos', 'Views', 'Joined'];
    const rows = data.map(channel => [
        channel.rank,
        channel.name,
        channel.subscribers,
        channel.videos,
        channel.views,
        channel.joined
    ]);
    
    return [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
} 

async function fetchCreatorData(filters) {
    showLoading();
    try {
        // In real implementation, this would be an API call
        const response = await fetch(`/api/creators?${new URLSearchParams(filters)}`);
        const data = await response.json();
        renderLeaderboard(data);
    } catch (error) {
        showError('Failed to load creator data');
    }
}

function renderLeaderboard(creators) {
    const leaderboardList = document.querySelector('.list-group');
    leaderboardList.innerHTML = creators.map((creator, index) => enhanceCreatorCard(creator)).join('');
} 

function enhanceCreatorCard(creator) {
    return `
        <div class="list-group-item p-3">
            <div class="d-flex align-items-center">
                <div class="position-relative">
                    <img src="${creator.image}" class="rounded-circle" width="80" height="80" alt="${creator.name}">
                    <span class="position-absolute top-0 start-0 badge bg-danger">#${creator.rank}</span>
                </div>
                <div class="ms-3 flex-grow-1">
                    <!-- Existing creator info -->
                    <div class="mt-3">
                        ${creator.hasStore ? `
                            <div class="merchandise-preview">
                                <h6 class="mb-2">Featured Merchandise</h6>
                                <div class="d-flex gap-2">
                                    ${creator.featuredProducts.map(product => `
                                        <div class="merch-item">
                                            <img src="${product.image}" class="rounded" width="50" height="50" alt="${product.name}">
                                            <small class="d-block text-muted">$${product.price}</small>
                                        </div>
                                    `).join('')}
                                    <a href="shop.html?creator=${creator.id}" class="btn btn-sm btn-outline-danger">
                                        View All Products
                                    </a>
                                </div>
                            </div>
                        ` : ''}
                        <div class="creator-actions mt-2">
                            <button class="btn btn-sm btn-outline-danger favorite-btn" data-creator-id="${creator.id}">
                                <i class="fas fa-heart"></i> Follow
                            </button>
                            <button class="btn btn-sm btn-outline-danger compare-btn" data-creator-id="${creator.id}">
                                <i class="fas fa-chart-line"></i> Compare
                            </button>
                            <button class="btn btn-sm btn-outline-danger analytics-btn" data-creator-id="${creator.id}">
                                <i class="fas fa-chart-bar"></i> Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
} 

function addAnalyticsPreview() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

    document.querySelectorAll('.creator-stats').forEach(stat => {
        const ctx = stat.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['7d', '6d', '5d', '4d', '3d', '2d', '1d'],
                datasets: [{
                    data: JSON.parse(stat.dataset.growth),
                    borderColor: '#dc3545',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    });
} 

class LeaderboardInteractions {
    constructor() {
        this.favorites = new Set(JSON.parse(localStorage.getItem('favoriteCreators') || '[]'));
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', e => {
            if (e.target.matches('.favorite-btn')) {
                this.toggleFavorite(e.target.dataset.creatorId);
            }
            if (e.target.matches('.compare-btn')) {
                this.addToComparison(e.target.dataset.creatorId);
            }
        });
    }

    toggleFavorite(creatorId) {
        if (this.favorites.has(creatorId)) {
            this.favorites.delete(creatorId);
        } else {
            this.favorites.add(creatorId);
        }
        localStorage.setItem('favoriteCreators', JSON.stringify([...this.favorites]));
        this.updateFavoriteButton(creatorId);
    }

    addToComparison(creatorId) {
        // Integrate with comparison tool
        window.location.href = `comparisontool.html?creators=${creatorId}`;
    }
} 

// Add Chart.js to your HTML
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

function addVisualizationDashboard() {
    const dashboardHTML = `
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Subscriber Distribution by Category</h5>
                        <canvas id="categoryChart"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Growth Trends</h5>
                        <canvas id="growthChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.container').insertAdjacentHTML('afterbegin', dashboardHTML);
    renderCharts();
}

function renderCharts() {
    // Category Distribution Chart
    const ctxCategory = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
            labels: ['Entertainment', 'Gaming', 'Education', 'Music', 'Sports'],
            datasets: [{
                data: [30, 25, 15, 20, 10],
                backgroundColor: [
                    '#dc3545', '#fd7e14', '#20c997', '#0dcaf0', '#6610f2'
                ]
            }]
        }
    });

    // Growth Trends Chart
    const ctxGrowth = document.getElementById('growthChart').getContext('2d');
    new Chart(ctxGrowth, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Average Growth Rate',
                data: [10, 15, 13, 18, 20, 17],
                borderColor: '#dc3545'
            }]
        }
    });
} 

function showCategoryInsights(category) {
    const insightsHTML = `
        <div class="category-insights card mb-4">
            <div class="card-body">
                <h5 class="card-title">${category} Category Insights</h5>
                <div class="row">
                    <div class="col-md-3">
                        <div class="stat-card">
                            <h6>Average Subscribers</h6>
                            <p class="h4">12.5M</p>
                            <small class="text-success">↑ 8% this month</small>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card">
                            <h6>Upload Frequency</h6>
                            <p class="h4">3.2/week</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card">
                            <h6>Avg. View Duration</h6>
                            <p class="h4">8:45</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card">
                            <h6>Engagement Rate</h6>
                            <p class="h4">5.8%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.container').insertAdjacentHTML('afterbegin', insightsHTML);
} 