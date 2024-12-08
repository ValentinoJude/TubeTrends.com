// Utility functions
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

document.addEventListener('DOMContentLoaded', function() {
    const channel1Input = document.getElementById('channel1');
    const channel2Input = document.getElementById('channel2');
    const compareButton = document.querySelector('.btn-danger');
    
    // Set up search functionality for each input
    [channel1Input, channel2Input].forEach((input) => {
        const container = input.closest('.form-floating');
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results d-none';
        container.appendChild(resultsDiv);

        // Add input event listener
        input.addEventListener('input', (e) => {
            const term = e.target.value.trim();
            if (term.length >= 2) {
                searchChannel(term, resultsDiv);
            } else {
                resultsDiv.classList.add('d-none');
            }
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                resultsDiv.classList.add('d-none');
            }
        });
    });

    // Compare button click handler
    compareButton.addEventListener('click', async () => {
        const id1 = channel1Input.getAttribute('data-channel-id');
        const id2 = channel2Input.getAttribute('data-channel-id');

        if (!id1 || !id2) {
            alert('Please select two channels from the search results');
            return;
        }

        try {
            const [channel1Data, channel2Data] = await Promise.all([
                YouTubeAPI.getChannelStats(id1),
                YouTubeAPI.getChannelStats(id2)
            ]);

            document.querySelector('.comparison-results').classList.remove('d-none');
            
            updateChannelCard(channel1Data.items[0], 1);
            updateChannelCard(channel2Data.items[0], 2);
            updateEngagementTable(channel1Data.items[0], channel2Data.items[0]);
        } catch (error) {
            console.error('Error comparing channels:', error);
            alert('An error occurred while comparing channels');
        }
    });
});

async function searchChannel(term, resultsDiv) {
    try {
        resultsDiv.innerHTML = '<div class="p-2">Searching...</div>';
        resultsDiv.classList.remove('d-none');

        const data = await YouTubeAPI.searchChannels(term);
        
        if (!data || !data.items) {
            resultsDiv.innerHTML = '<div class="p-2">No results found</div>';
            return;
        }

        resultsDiv.innerHTML = data.items.map(item => `
            <div class="search-result-item p-2" data-channel-id="${item.id.channelId}">
                <img src="${item.snippet.thumbnails.default.url}" alt="${item.snippet.channelTitle}">
                <span>${item.snippet.channelTitle}</span>
            </div>
        `).join('');

        // Add click handlers to search results
        resultsDiv.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const inputContainer = resultsDiv.closest('.form-floating');
                const input = inputContainer.querySelector('input');
                const channelId = item.dataset.channelId;
                const channelName = item.querySelector('span').textContent;

                input.value = channelName;
                input.setAttribute('data-channel-id', channelId);
                resultsDiv.classList.add('d-none');
            });
        });
    } catch (error) {
        console.error('Error searching channels:', error);
        resultsDiv.innerHTML = '<div class="p-2">Error searching channels</div>';
    }
}

function updateChannelCard(channelData, cardNumber) {
    const card = document.querySelector(`.col-md-6:nth-child(${cardNumber}) .card`);
    const title = card.querySelector('.card-title');
    const stats = card.querySelectorAll('.stat-item .h3');
    
    // Update channel name
    title.textContent = channelData.snippet.title;
    
    // Update stats
    const subscriberCount = parseInt(channelData.statistics.subscriberCount);
    const viewCount = parseInt(channelData.statistics.viewCount);
    const videoCount = parseInt(channelData.statistics.videoCount);
    
    stats[0].textContent = formatNumber(subscriberCount);
    stats[1].textContent = formatNumber(viewCount);
    stats[2].textContent = formatNumber(videoCount);
}

function updateEngagementTable(channel1, channel2) {
    const tbody = document.querySelector('.table tbody');
    
    // Calculate metrics
    const metrics = [
        {
            name: 'Subscribers',
            value1: parseInt(channel1.statistics.subscriberCount),
            value2: parseInt(channel2.statistics.subscriberCount),
            format: 'number'
        },
        {
            name: 'Total Views',
            value1: parseInt(channel1.statistics.viewCount),
            value2: parseInt(channel2.statistics.viewCount),
            format: 'number'
        },
        {
            name: 'Total Videos',
            value1: parseInt(channel1.statistics.videoCount),
            value2: parseInt(channel2.statistics.videoCount),
            format: 'number'
        },
        {
            name: 'Avg. Views per Video',
            value1: Math.round(parseInt(channel1.statistics.viewCount) / parseInt(channel1.statistics.videoCount)),
            value2: Math.round(parseInt(channel2.statistics.viewCount) / parseInt(channel2.statistics.videoCount)),
            format: 'number'
        }
    ];

    // Generate table rows
    tbody.innerHTML = metrics.map(metric => {
        const difference = metric.value1 - metric.value2;
        let formattedValue1, formattedValue2, formattedDiff;

        switch(metric.format) {
            case 'number':
                formattedValue1 = formatNumber(metric.value1);
                formattedValue2 = formatNumber(metric.value2);
                formattedDiff = formatNumber(difference);
                break;
            case 'decimal':
                formattedValue1 = metric.value1 + (metric.suffix || '');
                formattedValue2 = metric.value2 + (metric.suffix || '');
                formattedDiff = (metric.value1 - metric.value2).toFixed(1) + (metric.suffix || '');
                break;
            case 'percentage':
                formattedValue1 = metric.value1 + '%';
                formattedValue2 = metric.value2 + '%';
                formattedDiff = (metric.value1 - metric.value2).toFixed(1) + '%';
                break;
        }

        return `
            <tr>
                <td>${metric.name}</td>
                <td>${formattedValue1}</td>
                <td>${formattedValue2}</td>
                <td class="${difference > 0 ? 'text-success' : 'text-danger'}">
                    ${difference > 0 ? '+' : ''}${formattedDiff}
                </td>
            </tr>
        `;
    }).join('');
}