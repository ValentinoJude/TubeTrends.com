document.addEventListener('DOMContentLoaded', function() {
    const channel1Input = document.getElementById('channel1');
    const channel2Input = document.getElementById('channel2');
    
    function createSearchResults(input) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results d-none';
        input.parentNode.appendChild(resultsDiv);
        return resultsDiv;
    }

    async function searchChannel(term, resultsDiv) {
        // Mock API call (replace with real API later)
        const mockResults = [
            { id: 1, name: 'MrBeast', subscribers: '294M', avatar: 'Images/mrbeast.jpg' },
            { id: 2, name: 'PewDiePie', subscribers: '111M', avatar: 'Images/pewdiepie.jpg' },
            // Add more mock results
        ];

        resultsDiv.innerHTML = mockResults
            .filter(channel => channel.name.toLowerCase().includes(term.toLowerCase()))
            .map(channel => `
                <div class="search-result-item" data-channel-id="${channel.id}">
                    <img src="${channel.avatar}" alt="${channel.name}">
                    <div>
                        <div class="channel-name">${channel.name}</div>
                        <small class="text-muted">${channel.subscribers} subscribers</small>
                    </div>
                </div>
            `).join('');
        
        resultsDiv.classList.remove('d-none');
    }

    [channel1Input, channel2Input].forEach(input => {
        const resultsDiv = createSearchResults(input);
        let debounceTimer;

        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const term = input.value.trim();
                if (term.length >= 2) {
                    searchChannel(term, resultsDiv);
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
}); 

// Add this to your existing JavaScript
document.querySelector('.btn-danger').addEventListener('click', function() {
    const channel1 = document.getElementById('channel1').value;
    const channel2 = document.getElementById('channel2').value;
    
    if (channel1 && channel2) {
        updateComparison(channel1, channel2);
    } else {
        alert('Please select two channels to compare');
    }
});

function updateComparison(channel1, channel2) {
    // Update stats and charts with new data
    // This would typically involve an API call
    updateStats(channel1, channel2);
    updateGrowthChart(channel1, channel2);
    updateEngagementMetrics(channel1, channel2);
}