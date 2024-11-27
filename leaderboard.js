document.addEventListener('DOMContentLoaded', function() {
    // Get filter elements
    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');
    const timeSelect = document.getElementById('time-select');
    
    // Add event listeners
    categorySelect.addEventListener('change', updateLeaderboard);
    sortSelect.addEventListener('change', updateLeaderboard);
    timeSelect.addEventListener('change', updateLeaderboard);
    
    function updateLeaderboard() {
        // Get current filter values
        const category = categorySelect.value;
        const sortBy = sortSelect.value;
        const timeFrame = timeSelect.value;
        
        // Here you would typically make an API call to get filtered/sorted data
        // For now, we'll just log the filter values
        console.log('Filters:', {
            category,
            sortBy,
            timeFrame
        });
        
        // Example of how to update the URL with filter parameters
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('category', category);
        searchParams.set('sort', sortBy);
        searchParams.set('time', timeFrame);
        
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        history.pushState({}, '', newUrl);
    }
    
    // Handle pagination clicks
    document.querySelectorAll('.pagination .page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.textContent;
            
            // Update active state
            document.querySelectorAll('.page-item').forEach(item => {
                item.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Here you would typically load the new page of results
            console.log('Loading page:', page);
        });
    });
}); 