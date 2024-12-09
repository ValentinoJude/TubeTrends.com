import config from './config.js';

// List of popular YouTube channels to display
const CHANNEL_IDS = [
    'UCX6OQ3DkcsbYNE6H8uQQuVA', // MrBeast
    'UCq-Fj5jknLsUf-MWSy4_brA', // T-Series
    'UC-lHJZR3Gqxm24_Vd_AJ5Yw', // PewDiePie
    'UCbCmjCuTUZos6Inko4u57UQ', // Cocomelon
    'UCpEhnqL0y41EpW2TvWAHD7Q', // SET India
    'UC295-Dw_tDNtZXFeAPAW6Aw', // 5-Minute Crafts
    'UCffDXn7ycAzwL2LDlbyWOTw', // Zee Music Company
    'UCtI0Hodo5o5dUb67FeUjDeA', // Movieclips
    'UCYiGq8XF7YQD00x7wAd62Zg', // Zee TV
    'UCvlE5gTbOvjiolFlEm-c_Ow', // WWE
    'UCpko_-a4wgz2u_DgDgd9fqA', // BuzzFeed
    'UCJ5v_MCY6GNUBTO8-D3XoAg', // WWE Music
    'UCEdvpU2pFRCVqU6yIPyTpMQ', // Marshmello
    'UComP_epzeKzvBX156r6pm1Q', // Like Nastya
    'UCK8sQmJBp8GCxrOtXWBpyEA', // Google
    'UCOmHUn--16B90oW2L6FRR3A', // BLACKPINK
    'UC3IZKseVpdzPSBaWxBxundA', // HYBE LABELS
    'UCRijo3ddMTht_IHyNSNXpNQ', // Dude Perfect
    'UCF1JIbMUs6uqoZEY1Haw0GQ', // GR6
    'UCaWd5_7JhbQBe4dknZhsHJg', // WowKidz
    'UC_8PAD0Qmi6_gpe77S1Atgg', // Jess No Limit
    'UCBVjMGOIkavEAhyqpxJ73Dw', // Maroon 5
    'UCWOA1ZGywLbqmigxE4Qlvuw', // Netflix
    'UCJ0uqCI0Vqr2Rrt1HseGirg', // SpaceX
    'UCppHT7SZKKvar4Oc9J4oljQ', // Badabun
    'UCstEtN0pgOmCf02EdXsGChw', // ABS-CBN Entertainment
    'UCaHNFIob5Ixv74f5on3lvIw', // PowerKids TV
    'UCRv76wLBC73jiP7LX4C3l8Q', // EminemMusic
    'UCYLNGLIzMhRTi6ZOLjHO_wQ', // Speed Records
    'UCcabW7890RKJzL968QWEykA', // CS GAMING
    // ... continuing with more channels ...
    'UCZSNzBgFub_WWil6TOTYwAg', // ESPN
    'UCvC4D8onUfXzvjTOM-dBfEA', // Marvel Entertainment
    'UCJ5v_MCY6GNUBTO8-D3XoAg', // Justin Bieber
    'UCN1hnUccO4FD5WfM7ithXaw', // Marques Brownlee
    'UC3XTzVzaHQEd30rQbuvCtTQ', // LastWeekTonight
    'UCftwRNsjfRo08xYE31tkiyw', // WIRED
    'UCaHNFIob5Ixv74f5on3lvIw', // PowerKids TV
    'UCVTyTA7-g9nopHeHbeuvpRA', // Late Night with Seth Meyers
    'UCi8e0iOVk1fEOogdfu4YgfA', // Movieclips Trailers
    'UC4PooiX37Pld1T8J5SYT-SQ', // Good Mythical Morning
    // Add more channels as needed...
];

const CHANNELS_PER_PAGE = 10; // Number of channels to show per page
let currentPage = 1;
let allChannels = []; // Will store all fetched channels

const CHANNEL_CATEGORIES = {
    // Entertainment & Vlogging
    'UCX6OQ3DkcsbYNE6H8uQQuVA': 'entertainment',     // MrBeast
    'UC-lHJZR3Gqxm24_Vd_AJ5Yw': 'entertainment',     // PewDiePie
    'UCpko_-a4wgz2u_DgDgd9fqA': 'entertainment',     // BuzzFeed
    'UCVTyTA7-g9nopHeHbeuvpRA': 'entertainment',     // Late Night with Seth Meyers
    'UC4PooiX37Pld1T8J5SYT-SQ': 'entertainment',     // Good Mythical Morning

    // Music & Record Labels
    'UCq-Fj5jknLsUf-MWSy4_brA': 'music',             // T-Series
    'UCffDXn7ycAzwL2LDlbyWOTw': 'music',             // Zee Music Company
    'UCJ5v_MCY6GNUBTO8-D3XoAg': 'music',             // WWE Music
    'UCEdvpU2pFRCVqU6yIPyTpMQ': 'music',             // Marshmello
    'UCOmHUn--16B90oW2L6FRR3A': 'music',             // BLACKPINK
    'UC3IZKseVpdzPSBaWxBxundA': 'music',             // HYBE LABELS
    'UCBVjMGOIkavEAhyqpxJ73Dw': 'music',             // Maroon 5
    'UCRv76wLBC73jiP7LX4C3l8Q': 'music',             // EminemMusic
    'UCYLNGLIzMhRTi6ZOLjHO_wQ': 'music',             // Speed Records

    // Kids & Education
    'UCbCmjCuTUZos6Inko4u57UQ': 'kids',              // Cocomelon
    'UComP_epzeKzvBX156r6pm1Q': 'kids',              // Like Nastya
    'UCaWd5_7JhbQBe4dknZhsHJg': 'kids',              // WowKidz
    'UCaHNFIob5Ixv74f5on3lvIw': 'kids',              // PowerKids TV

    // Media & Movies
    'UCtI0Hodo5o5dUb67FeUjDeA': 'movies',            // Movieclips
    'UCYiGq8XF7YQD00x7wAd62Zg': 'media',             // Zee TV
    'UCWOA1ZGywLbqmigxE4Qlvuw': 'movies',            // Netflix
    'UCstEtN0pgOmCf02EdXsGChw': 'media',             // ABS-CBN Entertainment
    'UCvC4D8onUfXzvjTOM-dBfEA': 'movies',            // Marvel Entertainment
    'UCi8e0iOVk1fEOogdfu4YgfA': 'movies',            // Movieclips Trailers
    'UCpEhnqL0y41EpW2TvWAHD7Q': 'media',             // SET India
    'UCppHT7SZKKvar4Oc9J4oljQ': 'media',             // Badabun

    // Sports & Gaming
    'UCvlE5gTbOvjiolFlEm-c_Ow': 'sports',            // WWE
    'UCRijo3ddMTht_IHyNSNXpNQ': 'sports',            // Dude Perfect
    'UCZSNzBgFub_WWil6TOTYwAg': 'sports',            // ESPN
    'UCF1JIbMUs6uqoZEY1Haw0GQ': 'gaming',            // GR6
    'UC_8PAD0Qmi6_gpe77S1Atgg': 'gaming',            // Jess No Limit
    'UCcabW7890RKJzL968QWEykA': 'gaming',            // CS GAMING

    // Tech & Science
    'UCK8sQmJBp8GCxrOtXWBpyEA': 'tech',              // Google
    'UCJ0uqCI0Vqr2Rrt1HseGirg': 'tech',              // SpaceX
    'UCN1hnUccO4FD5WfM7ithXaw': 'tech',              // Marques Brownlee
    'UCftwRNsjfRo08xYE31tkiyw': 'tech',              // WIRED

    // How-to & Educational
    'UC295-Dw_tDNtZXFeAPAW6Aw': 'howto',             // 5-Minute Crafts

    // News & Commentary
    'UC3XTzVzaHQEd30rQbuvCtTQ': 'news'               // LastWeekTonight
};

// Updated main categories based on actual usage
const MAIN_CATEGORIES = [
    'entertainment',
    'music',
    'kids',
    'movies',
    'media',
    'sports',
    'gaming',
    'tech',
    'howto',
    'news'
];

async function fetchChannelData() {
    try {
        console.log('Fetching channel data...');
        let attempts = 0;
        const maxAttempts = config.YOUTUBE_API_KEYS.length;

        while (attempts < maxAttempts) {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_IDS.join(',')}&key=${config.YOUTUBE_API_KEYS[config.currentKeyIndex]}`
                );

                if (response.status === 403) {
                    console.log(`API Key ${config.currentKeyIndex + 1} quota exceeded, trying next key...`);
                    config.currentKeyIndex = (config.currentKeyIndex + 1) % config.YOUTUBE_API_KEYS.length;
                    attempts++;
                    continue;
                }

                if (!response.ok) {
                    throw new Error('API request failed');
                }

                const data = await response.json();
                console.log('Received data:', data);
                return data.items;
            } catch (error) {
                attempts++;
                if (attempts === maxAttempts) {
                    console.error('All API keys have exceeded their quota');
                    throw new Error('All API keys quota exceeded');
                }
                config.currentKeyIndex = (config.currentKeyIndex + 1) % config.YOUTUBE_API_KEYS.length;
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
}

function sortChannels(channels, sortBy) {
    console.log('Sorting by:', sortBy);
    
    const statisticsField = {
        'subscriber': 'subscriberCount',
        'view': 'viewCount',
        'video': 'videoCount'
    }[sortBy];

    // Add specific logging for video counts
    if (sortBy === 'video') {
        console.log('First 5 channels before sorting:');
        channels.slice(0, 5).forEach(channel => {
            console.log(`${channel.snippet.title}: raw value = ${channel.statistics.videoCount}, parsed value = ${parseInt(channel.statistics.videoCount)}`);
        });
    }

    const sortedChannels = [...channels].sort((a, b) => {
        const valueA = parseInt(a.statistics[statisticsField]);
        const valueB = parseInt(b.statistics[statisticsField]);
        
        // Add error checking for video sorting
        if (isNaN(valueA) || isNaN(valueB)) {
            console.error('Invalid values detected:', {
                channelA: a.snippet.title,
                valueA: a.statistics[statisticsField],
                channelB: b.snippet.title,
                valueB: b.statistics[statisticsField]
            });
        }
        
        return valueB - valueA;
    });

    // Verify the sort worked
    if (sortBy === 'video') {
        console.log('First 5 channels after sorting:');
        sortedChannels.slice(0, 5).forEach(channel => {
            console.log(`${channel.snippet.title}: ${channel.statistics.videoCount} videos`);
        });
    }

    return sortedChannels;
}

// Add this function to filter channels by category
function filterChannelsByCategory(channels, category) {
    if (category === 'all') return channels;
    
    console.log('Filtering by category:', category);
    const filteredChannels = channels.filter(channel => {
        const channelCategory = CHANNEL_CATEGORIES[channel.id];
        const channelTitle = channel.snippet.title;
        
        // Log any channels that don't have a category mapping
        if (!channelCategory) {
            console.warn(`Warning: No category mapping for channel: ${channelTitle} (ID: ${channel.id})`);
        }
        
        // Log category matches for sports
        if (category === 'sports') {
            console.log(`Sports check - Channel: ${channelTitle}, Category: ${channelCategory}, Match: ${channelCategory === category}`);
        }
        
        return channelCategory === category;
    });
    
    console.log(`Found ${filteredChannels.length} channels in category '${category}':`);
    console.log(filteredChannels.map(c => c.snippet.title));
    
    return filteredChannels;
}

// Modify the updateLeaderboard function to handle categories
function updateLeaderboard(channels, page = 1, sortBy = 'subscriber', category = 'all') {
    const leaderboard = document.getElementById('leaderboard-list');
    const pagination = document.querySelector('.pagination');
    
    if (!leaderboard) {
        console.error('Leaderboard element not found');
        return;
    }

    // First filter by category
    const filteredChannels = filterChannelsByCategory(channels, category);
    
    // Then sort the filtered channels
    const sortedChannels = sortChannels(filteredChannels, sortBy);
    allChannels = channels; // Keep the original unfiltered channels in global state

    // Calculate pagination based on filtered results
    const totalPages = Math.ceil(sortedChannels.length / CHANNELS_PER_PAGE);
    const startIndex = (page - 1) * CHANNELS_PER_PAGE;
    const endIndex = startIndex + CHANNELS_PER_PAGE;
    const channelsToShow = sortedChannels.slice(startIndex, endIndex);

    // Update channel list
    const leaderboardHTML = channelsToShow.map((channel, index) => `
        <div class="list-group-item p-3">
            <div class="d-flex align-items-center">
                <span class="me-3 h5 mb-0">#${startIndex + index + 1}</span>
                <a href="channel.html?id=${channel.id}" class="channel-link d-flex align-items-center text-decoration-none flex-grow-1">
                    <img src="${channel.snippet.thumbnails.default.url}" 
                         class="rounded-circle me-3" 
                         width="50" 
                         height="50" 
                         alt="${channel.snippet.title}">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 text-dark">${channel.snippet.title}</h6>
                        <div class="d-flex mt-2">
                            <span class="me-4">
                                <i class="fas fa-users me-2"></i>
                                ${formatNumber(parseInt(channel.statistics.subscriberCount))}
                            </span>
                            <span class="me-4">
                                <i class="fas fa-eye me-2"></i>
                                ${formatNumber(parseInt(channel.statistics.viewCount))}
                            </span>
                            <span>
                                <i class="fas fa-video me-2"></i>
                                ${formatNumber(parseInt(channel.statistics.videoCount))}
                            </span>
                        </div>
                    </div>
                    <i class="fas fa-chevron-right ms-3 text-muted"></i>
                </a>
            </div>
        </div>
    `).join('');

    leaderboard.innerHTML = leaderboardHTML;
    updatePagination(totalPages, page);
}

// Add this new function to handle pagination UI
function updatePagination(totalPages, currentPage) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    let paginationHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
        </li>
    `;

    // Add first page
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'active' : ''}">
            <a class="page-link" href="#" data-page="1">1</a>
        </li>
    `;

    // Add ellipsis and middle pages
    if (totalPages > 7) {
        if (currentPage > 3) {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
            paginationHTML += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        if (currentPage < totalPages - 2) {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    } else {
        // If few pages, show all
        for (let i = 2; i < totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
    }

    // Add last page if more than one page
    if (totalPages > 1) {
        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
            </li>
        `;
    }

    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
        </li>
    `;

    pagination.innerHTML = paginationHTML;
}

// Add event listeners for pagination
function initializePagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    pagination.addEventListener('click', (e) => {
        e.preventDefault();
        const pageLink = e.target.closest('.page-link');
        if (!pageLink) return;

        const newPage = parseInt(pageLink.dataset.page);
        if (newPage && newPage !== currentPage) {
            currentPage = newPage;
            updateLeaderboard(allChannels, currentPage);
            // Scroll to top of leaderboard
            document.getElementById('leaderboard-list').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Add this near the top of the file with other event listeners
document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        // Convert the select values to match your existing sort function
        const sortMapping = {
            'subscriber': 'subscriber',
            'view': 'view',
            'video': 'video'
        };
        updateLeaderboard(allChannels, currentPage, sortMapping[sortValue]);
    });
});

// Update the initialization code
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, fetching data...');
    const channels = await fetchChannelData();
    if (channels.length > 0) {
        updateLeaderboard(channels, 1);
        initializePagination();
    } else {
        console.error('No channel data received');
    }
});

// Add event listener for category select
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');
    
    // Populate category select
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    MAIN_CATEGORIES.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });

    // Category change handler
    categorySelect.addEventListener('change', function() {
        const categoryValue = this.value;
        const sortValue = sortSelect.value;
        currentPage = 1; // Reset to first page when changing category
        updateLeaderboard(allChannels, currentPage, sortValue, categoryValue);
    });
}); 