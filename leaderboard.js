document.addEventListener('DOMContentLoaded', function() {
    // Get filter elements
    const categorySelect = document.getElementById('content-category');
    const growthPeriod = document.getElementById('growth-period');
    const sortBy = document.getElementById('sort-by');
    
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