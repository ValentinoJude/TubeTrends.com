document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update button icons and classes
        if (theme === 'dark') {
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
            themeToggle.className = 'btn btn-outline-dark btn-sm'; // Reset and set new classes
        } else {
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
            themeToggle.className = 'btn btn-outline-light btn-sm'; // Reset and set new classes
        }

        // Add transition effect
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }

    // Add system theme preference detection
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDarkScheme.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

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
}); 