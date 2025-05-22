// calendar.js - Updated to place image after artist name

document.addEventListener('DOMContentLoaded', function() {
    const filterFinnishCheckbox = document.getElementById('filter-finnish');
    const upcomingReleases = document.querySelectorAll('#upcoming-releases .release-item');
    const releasedItems = document.querySelectorAll('#released .release-item');
    const upcomingCount = document.querySelector('#upcoming-releases .release-count');
    const releasedCount = document.querySelector('#released .release-count');

    // Function to filter releases
    function filterReleases() {
        const onlyFinnish = filterFinnishCheckbox.checked;
        
        // Filter upcoming releases
        let upcomingVisible = 0;
        upcomingReleases.forEach(item => {
            const isDomestic = item.getAttribute('data-domestic') === 'true';
            
            if (onlyFinnish && !isDomestic) {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
                upcomingVisible++;
            }
        });
        
        // Filter released items
        let releasedVisible = 0;
        releasedItems.forEach(item => {
            const isDomestic = item.getAttribute('data-domestic') === 'true';
            
            if (onlyFinnish && !isDomestic) {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
                releasedVisible++;
            }
        });
        
        // Update counts
        upcomingCount.textContent = `(${upcomingVisible})`;
        releasedCount.textContent = `(${releasedVisible})`;
    }
    
    // Function to set initial counts
    function updateInitialCounts() {
        // Set the actual counts based on number of items
        upcomingCount.textContent = `(${upcomingReleases.length})`;
        releasedCount.textContent = `(${releasedItems.length})`;
    }
    
    // Initialize counts on page load
    updateInitialCounts();
    
    // Add event listener to checkbox
    filterFinnishCheckbox.addEventListener('change', filterReleases);

    // Generate placeholder images for artists
    function generatePlaceholderImages() {
        const releaseItems = document.querySelectorAll('.release-item[data-spotify-id]');
        
        releaseItems.forEach(item => {
            const artistHeader = item.querySelector('.release-info h4');
            const artistName = artistHeader.textContent.trim();
            
            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'artist-image';
            
            // Create image element
            const img = document.createElement('img');
            
            // Use static colors for all placeholders
            const bgColor = '#333333';  // Dark grey background
            const textColor = '#f4900c'; // Räppicord orange for text
            
            // Get artist initials
            const initials = getInitials(artistName);
            img.src = generateInitialsPlaceholder(initials, bgColor, textColor);
            img.alt = artistName;
            
            // Add image to container
            imageContainer.appendChild(img);
            
            // Clear the h4 and rebuild with artist name + image
            artistHeader.innerHTML = '';
            artistHeader.appendChild(document.createTextNode(artistName));
            artistHeader.appendChild(imageContainer);
        });
    }
    
    // Helper function to get initials from name
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    
    // Generate a placeholder SVG with initials
    function generateInitialsPlaceholder(initials, bgColor, textColor) {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
            <rect width="30" height="30" fill="${bgColor}" />
            <text x="15" y="15" fill="${textColor}" font-size="12" 
                  font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle" 
                  dominant-baseline="middle">${initials}</text>
        </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }
    
    // Generate the placeholder images
    generatePlaceholderImages();
});