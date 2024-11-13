const searchButton = document.querySelector('.search-btn');

searchButton.addEventListener('click', () => {
  // Get the search term from the input field
  const searchTerm = document.querySelector('input[name="search"]').value;
  
  // Perform search logic using the searchTerm variable (e.g., filter leaderboard results)
  console.log("Search term:", searchTerm);
  // Replace the console.log with your search functionality
});
