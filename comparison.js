import YouTubeAPI from './api.js';

// Utility Functions
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

function formatDifference(diff, isCurrency = false) {
    const formattedDiff = formatNumber(Math.abs(diff));
    const className = diff > 0 ? 'text-success' : 'text-danger';
    const sign = diff > 0 ? '+' : '-';
    return `<span class="${className}">${sign}${isCurrency ? '$' : ''}${formattedDiff}</span>`;
}

function calculateEngagementRate(channel) {
    const views = parseInt(channel.statistics.viewCount);
    const subs = parseInt(channel.statistics.subscriberCount);
    return ((views / subs) * 100).toFixed(1);
}

function generateGrowthData(currentValue) {
    const current = parseInt(currentValue);
    return Array.from({length: 6}, (_, i) => {
        const monthsAgo = 5 - i;
        return (current / Math.pow(1.02, monthsAgo)) / 1000000;
    });
}

// UI Update Functions
function updateStats(channel1Data, channel2Data) {
    try {
        console.log('Updating stats for:', {
            channel1: channel1Data.snippet.title,
            channel2: channel2Data.snippet.title
        });

        // Update channel 1
        const channel1Card = document.querySelector('.col-md-6:nth-child(1)');
        if (!channel1Card) throw new Error('Channel 1 card not found');
        
        channel1Card.querySelector('.card-title').textContent = channel1Data.snippet.title;
        const stats1 = channel1Card.querySelectorAll('.stat-item');
        
        stats1[0].querySelector('.h3').textContent = formatNumber(channel1Data.statistics.subscriberCount);
        stats1[1].querySelector('.h3').textContent = formatNumber(channel1Data.statistics.viewCount);
        stats1[2].querySelector('.h3').textContent = calculateEngagementRate(channel1Data) + '%';

        // Update channel 2
        const channel2Card = document.querySelector('.col-md-6:nth-child(2)');
        if (!channel2Card) throw new Error('Channel 2 card not found');
        
        channel2Card.querySelector('.card-title').textContent = channel2Data.snippet.title;
        const stats2 = channel2Card.querySelectorAll('.stat-item');
        
        stats2[0].querySelector('.h3').textContent = formatNumber(channel2Data.statistics.subscriberCount);
        stats2[1].querySelector('.h3').textContent = formatNumber(channel2Data.statistics.viewCount);
        stats2[2].querySelector('.h3').textContent = calculateEngagementRate(channel2Data) + '%';

        // Update table headers
        document.querySelectorAll('.channel1-name').forEach(el => el.textContent = channel1Data.snippet.title);
        document.querySelectorAll('.channel2-name').forEach(el => el.textContent = channel2Data.snippet.title);

        console.log('Stats update completed successfully');

    } catch (error) {
        console.error('Error in updateStats:', error);
        throw new Error('Failed to update statistics: ' + error.message);
    }
}

function updateGrowthChart(channel1Data, channel2Data) {
    try {
        // Get the chart container
        const chartContainer = document.querySelector('.card-body');
        const oldCanvas = document.getElementById('growthChart');
        
        // Remove old canvas and create new one
        if (oldCanvas) {
            oldCanvas.remove();
        }
        
        // Create new canvas
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'growthChart';
        chartContainer.appendChild(newCanvas);
        
        // Create new chart
        const ctx = newCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: channel1Data.snippet.title,
                    data: generateGrowthData(channel1Data.statistics.subscriberCount),
                    borderColor: 'rgb(13, 110, 253)',
                    tension: 0.1,
                    fill: false
                }, {
                    label: channel2Data.snippet.title,
                    data: generateGrowthData(channel2Data.statistics.subscriberCount),
                    borderColor: 'rgb(25, 135, 84)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Subscriber Growth Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Subscribers (Millions)'
                        }
                    }
                }
            }
        });

        console.log('Growth chart updated successfully');

    } catch (error) {
        console.error('Error updating growth chart:', error);
        throw error;
    }
}

function updateEngagementMetrics(channel1Data, channel2Data) {
    try {
        // Calculate average views per video
        const avgViews1 = Math.round(channel1Data.statistics.viewCount / channel1Data.statistics.videoCount);
        const avgViews2 = Math.round(channel2Data.statistics.viewCount / channel2Data.statistics.videoCount);
        const viewsDiff = avgViews1 - avgViews2;

        // Calculate views per subscriber (engagement rate)
        const viewsPerSub1 = (channel1Data.statistics.viewCount / channel1Data.statistics.subscriberCount).toFixed(1);
        const viewsPerSub2 = (channel2Data.statistics.viewCount / channel2Data.statistics.subscriberCount).toFixed(1);
        const viewsPerSubDiff = (viewsPerSub1 - viewsPerSub2).toFixed(1);

        // Calculate estimated revenue (using average CPM of $2-$5)
        const avgCPM = 3.5; // $3.50 per 1000 views
        const monthlyViews1 = channel1Data.statistics.viewCount / 12; // Estimated monthly views
        const monthlyViews2 = channel2Data.statistics.viewCount / 12;
        
        const monthlyRevenue1 = (monthlyViews1 / 1000) * avgCPM;
        const monthlyRevenue2 = (monthlyViews2 / 1000) * avgCPM;
        const revenueDiff = monthlyRevenue1 - monthlyRevenue2;

        // Calculate yearly revenue
        const yearlyRevenue1 = monthlyRevenue1 * 12;
        const yearlyRevenue2 = monthlyRevenue2 * 12;
        const yearlyRevenueDiff = yearlyRevenue1 - yearlyRevenue2;

        // Update the table
        const table = document.querySelector('.table tbody');
        table.innerHTML = `
            <tr>
                <td>Avg. Views per Video</td>
                <td>${formatNumber(avgViews1)}</td>
                <td>${formatNumber(avgViews2)}</td>
                <td>${formatDifference(viewsDiff)}</td>
            </tr>
            <tr>
                <td>Views per Subscriber</td>
                <td>${viewsPerSub1}</td>
                <td>${viewsPerSub2}</td>
                <td>${formatDifference(viewsPerSubDiff)}</td>
            </tr>
            <tr>
                <td>Est. Monthly Revenue</td>
                <td>$${formatNumber(monthlyRevenue1)}</td>
                <td>$${formatNumber(monthlyRevenue2)}</td>
                <td>${formatDifference(revenueDiff, true)}</td>
            </tr>
            <tr>
                <td>Est. Yearly Revenue</td>
                <td>$${formatNumber(yearlyRevenue1)}</td>
                <td>$${formatNumber(yearlyRevenue2)}</td>
                <td>${formatDifference(yearlyRevenueDiff, true)}</td>
            </tr>
        `;

        // Add tooltips for revenue estimates
        addRevenueTooltips();

        console.log('Engagement metrics updated successfully');

    } catch (error) {
        console.error('Error updating engagement metrics:', error);
        throw error;
    }
}

function addRevenueTooltips() {
    const revenueRows = document.querySelectorAll('tr:nth-child(3), tr:nth-child(4)');
    revenueRows.forEach(row => {
        const td = row.querySelector('td:first-child');
        td.style.position = 'relative';
        td.innerHTML += `
            <i class="fas fa-info-circle ms-2" 
               data-bs-toggle="tooltip" 
               data-bs-placement="right" 
               title="Estimated using average YouTube CPM of $3.50. Actual revenue may vary based on niche, location, and engagement.">
            </i>
        `;
    });
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
}

// Main Functions
async function updateComparison(channel1Data, channel2Data) {
    try {
        console.log('Starting comparison update with:', {
            channel1: channel1Data,
            channel2: channel2Data
        });

        // Show comparison results
        document.getElementById('comparison-results').style.display = 'block';

        // Update all sections with error handling
        await Promise.all([
            updateStats(channel1Data, channel2Data),
            updateGrowthChart(channel1Data, channel2Data),
            updateEngagementMetrics(channel1Data, channel2Data)
        ]);

        console.log('Comparison update completed successfully');

    } catch (error) {
        console.error('Error in updateComparison:', error);
        throw new Error('Failed to update comparison: ' + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const channel1Input = document.getElementById('channel1');
    const channel2Input = document.getElementById('channel2');
    
    function createSearchResults(input) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results d-none';
        input.parentNode.appendChild(resultsDiv);
        return resultsDiv;
    }

    async function searchChannel(term, resultsDiv, input) {
        try {
            const response = await YouTubeAPI.searchChannels(term);
            
            if (!response.items) {
                resultsDiv.innerHTML = '<div class="p-2">No results found</div>';
                return;
            }

            resultsDiv.innerHTML = response.items
                .map(channel => `
                    <div class="search-result-item" data-channel-id="${channel.id.channelId}">
                        <img src="${channel.snippet.thumbnails.default.url}" alt="${channel.snippet.title}">
                        <div>
                            <div class="channel-name">${channel.snippet.title}</div>
                            <small class="text-muted">${channel.snippet.description.substring(0, 50)}...</small>
                        </div>
                    </div>
                `).join('');
            
            // Add click handlers for results
            resultsDiv.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', async () => {
                    const channelId = item.dataset.channelId;
                    const channelData = await YouTubeAPI.getChannelStats(channelId);
                    const channel = channelData.items[0];
                    
                    input.value = channel.snippet.title;
                    input.dataset.channelId = channelId;
                    resultsDiv.classList.add('d-none');
                });
            });
            
            resultsDiv.classList.remove('d-none');
        } catch (error) {
            console.error('Error searching channels:', error);
            resultsDiv.innerHTML = '<div class="p-2 text-danger">Error searching channels</div>';
        }
    }

    [channel1Input, channel2Input].forEach(input => {
        const resultsDiv = createSearchResults(input);
        let debounceTimer;

        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const term = input.value.trim();
                if (term.length >= 2) {
                    searchChannel(term, resultsDiv, input);
                } else {
                    resultsDiv.classList.add('d-none');
                }
            }, 300);
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !resultsDiv.contains(e.target)) {
                resultsDiv.classList.add('d-none');
            }
        });
    });

    // Compare button click handler
    document.querySelector('.btn-danger').addEventListener('click', async function() {
        try {
            const channel1Id = channel1Input.dataset.channelId;
            const channel2Id = channel2Input.dataset.channelId;
            
            if (!channel1Id || !channel2Id) {
                alert('Please select two channels to compare');
                return;
            }

            // Show loading state
            document.querySelector('.btn-danger').disabled = true;
            document.querySelector('.btn-danger').innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Comparing...';

            console.log('Fetching data for channels:', { channel1Id, channel2Id });

            const [channel1Response, channel2Response] = await Promise.all([
                YouTubeAPI.getChannelStats(channel1Id),
                YouTubeAPI.getChannelStats(channel2Id)
            ]);

            console.log('API Responses:', {
                channel1: channel1Response,
                channel2: channel2Response
            });

            if (!channel1Response.items?.[0] || !channel2Response.items?.[0]) {
                throw new Error('Invalid channel data received');
            }

            const channel1Data = channel1Response.items[0];
            const channel2Data = channel2Response.items[0];

            // Validate required data
            if (!channel1Data.snippet || !channel1Data.statistics || 
                !channel2Data.snippet || !channel2Data.statistics) {
                throw new Error('Missing required channel data');
            }

            // Add this inside your compare button click handler, after getting the API responses
            console.log('Channel 1 Statistics:', channel1Data.statistics);
            console.log('Channel 2 Statistics:', channel2Data.statistics);

            await updateComparison(channel1Data, channel2Data);

        } catch (error) {
            console.error('Comparison error:', error);
            alert(`Error: ${error.message || 'Failed to compare channels. Please try again.'}`);
        } finally {
            // Reset button state
            document.querySelector('.btn-danger').disabled = false;
            document.querySelector('.btn-danger').innerHTML = 'Compare';
        }
    });

    // Add this at the start of your file to ensure we have a clean chart instance
    window.growthChart = null;
});
