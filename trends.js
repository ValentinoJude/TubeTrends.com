document.addEventListener('DOMContentLoaded', function() {
    // Timeline Chart
    const timelineCtx = document.getElementById('trendTimeline').getContext('2d');
    new Chart(timelineCtx, {
        type: 'line',
        data: {
            labels: ['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan'],
            datasets: [{
                label: 'Trend Popularity',
                data: [30, 45, 75, 90, 85],
                borderColor: '#dc3545',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Engagement Chart
    const engagementCtx = document.getElementById('engagementChart').getContext('2d');
    new Chart(engagementCtx, {
        type: 'doughnut',
        data: {
            labels: ['Likes', 'Comments', 'Shares'],
            datasets: [{
                data: [65, 20, 15],
                backgroundColor: ['#dc3545', '#ffc107', '#0dcaf0']
            }]
        }
    });

    // Challenge Timer
    function updateTimer() {
        const timer = document.getElementById('challengeTimer');
        // Add countdown logic here
    }

    // Community Pulse Interaction
    document.querySelectorAll('.community-vote').forEach(button => {
        button.addEventListener('click', function() {
            // Add voting logic here
        });
    });

    // Map initialization
    const map = L.map('trendMap').setView([20, 0], 2);
    
    // Add dark theme map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Sample trend data
    const trendData = [
        { location: [40.7128, -74.0060], intensity: 0.9, city: "New York", country: "USA" },
        { location: [51.5074, -0.1278], intensity: 0.8, city: "London", country: "UK" },
        { location: [35.6762, 139.6503], intensity: 0.7, city: "Tokyo", country: "Japan" },
        { location: [-33.8688, 151.2093], intensity: 0.6, city: "Sydney", country: "Australia" },
        { location: [48.8566, 2.3522], intensity: 0.75, city: "Paris", country: "France" },
        { location: [-1.2921, 36.8219], intensity: 0.65, city: "Nairobi", country: "Kenya" },
        { location: [55.7558, 37.6173], intensity: 0.7, city: "Moscow", country: "Russia" },
        { location: [19.4326, -99.1332], intensity: 0.8, city: "Mexico City", country: "Mexico" },
        { location: [-22.9068, -43.1729], intensity: 0.85, city: "Rio de Janeiro", country: "Brazil" },
        { location: [31.2304, 121.4737], intensity: 0.95, city: "Shanghai", country: "China" }
    ];

    // Custom icon for markers
    const trendIcon = L.divIcon({
        className: 'trend-marker',
        html: '<div class="marker-pulse"></div>',
        iconSize: [15, 15]
    });

    // Add markers for each trend location
    trendData.forEach(point => {
        const marker = L.marker(point.location, { icon: trendIcon })
            .addTo(map)
            .bindPopup(`
                <div class="trend-popup">
                    <strong>${point.city}, ${point.country}</strong>
                    <div class="trend-intensity">
                        Trend Intensity: ${(point.intensity * 100).toFixed(0)}%
                        <div class="progress mt-2" style="height: 5px;">
                            <div class="progress-bar bg-danger" 
                                 style="width: ${point.intensity * 100}%">
                            </div>
                        </div>
                    </div>
                </div>
            `);
    });

    // Add circle overlays to show trend intensity
    trendData.forEach(point => {
        L.circle(point.location, {
            color: '#dc3545',
            fillColor: '#dc3545',
            fillOpacity: point.intensity * 0.3,
            radius: 200000 * point.intensity
        }).addTo(map);
    });
}); 