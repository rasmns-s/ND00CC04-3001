// Gallery functionality with auto-population from folder and sorting
document.addEventListener('DOMContentLoaded', function() {
    // Declare variables at the top for better scope management
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortOptions = document.getElementById('sort-options');
    const galleryGrid = document.getElementById('gallery-grid');
    let galleryItems = []; // Will be populated after gallery is built
    let galleryData = []; // Will store all gallery items with metadata for sorting
    
    // Auto-populate gallery from file list
    autoPopulateGallery();
    
    // FILTER FUNCTIONS
    function setupFilters() {
        galleryItems = document.querySelectorAll('.gallery-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide gallery items based on filter
                galleryItems.forEach(item => {
                    item.style.display = (filterValue === 'all' || item.classList.contains(filterValue)) 
                        ? 'block' 
                        : 'none';
                });
            });
        });
    }
    
    // SORTING FUNCTIONS
    function setupSorting() {
        if (sortOptions) {
            sortOptions.addEventListener('change', function() {
                sortGalleryItems(this.value);
            });
        }
    }
    
    function sortGalleryItems(sortMethod) {
        // Sort the gallery data array based on selected method
        switch(sortMethod) {
            case 'newest':
                galleryData.sort((a, b) => b.date - a.date);
                break;
            case 'oldest':
                galleryData.sort((a, b) => a.date - b.date);
                break;
            case 'name-asc':
                galleryData.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                galleryData.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'type':
                galleryData.sort((a, b) => a.type.localeCompare(b.type));
                break;
            default:
                galleryData.sort((a, b) => b.date - a.date);
        }
        
        // Rebuild the gallery with sorted items
        galleryGrid.innerHTML = '';
        galleryData.forEach(item => {
            galleryGrid.innerHTML += item.html;
        });
        
        // Get updated references to the new DOM elements
        galleryItems = document.querySelectorAll('.gallery-item');
        
        // Apply current filter
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            const filterValue = activeFilter.getAttribute('data-filter');
            galleryItems.forEach(item => {
                item.style.display = (filterValue === 'all' || item.classList.contains(filterValue)) 
                    ? 'block' 
                    : 'none';
            });
        }
        
        // Reset event handlers
        setupVideoClicks();
        setupImageClicks();
    }
    
    // GALLERY POPULATION FUNCTIONS
    function parseFileTree(treeContent) {
        return treeContent.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && 
                (line.endsWith('.png') || 
                 line.endsWith('.jpg') || 
                 line.endsWith('.jpeg')) &&
                !line.includes('filetree.txt'))
            .map(line => line.replace(/^[^a-zA-Z0-9]*/, ''));
    }
    
    function autoPopulateGallery() {
        // Clear any existing items and data
        galleryGrid.innerHTML = '';
        galleryData = [];
        
        // Get files from filetree.txt
        // const filetreeContent = `...`; // Actual content should be here
        const files = parseFileTree(filetreeContent);
        
        // Process image files
        processImageFiles(files);
        
        // Process videos
        processVideos();
        
        // Sort items by date (newest first) before rendering
        galleryData.sort((a, b) => b.date - a.date);
        
        // Build gallery HTML
        renderGallery();
        
        // Set up event handlers
        setupVideoClicks();
        setupImageClicks();
        setupFilters();
        setupSorting();
    }
    
    function processImageFiles(files) {
        files.forEach((filename, index) => {
            // Extract date from filename
            const dateMatch = filename.match(/photo-(\d{4}-\d{2}-\d{2})/);
            const dateStr = dateMatch ? dateMatch[1] : '';
            let date;
            
            // Parse date
            if (dateStr) {
                const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
                date = new Date(year, month - 1, day);
                
                if (isNaN(date.getTime())) {
                    date = new Date();
                    console.warn(`Invalid date parsed from: ${filename}`);
                }
            } else {
                date = new Date();
            }
            
            // Extract title and determine category
            let title = filename.replace(/photo-\d{4}-\d{2}-\d{2}-/, "").replace(/\.(png|jpg|jpeg)$/, "");
            
            const weekMatch = filename.match(/vk(\d+)/);
            const weekNum = weekMatch ? parseInt(weekMatch[1]) : null;
            
            let displayTitle = title;
            if (weekNum) {
                displayTitle = `Viikko ${weekNum}`;
                if (title.includes("spot")) {
                    displayTitle += " Spotify -kansi";
                }
                if (title.includes("julkasut")) {
                    displayTitle += " Tiktok -spotlight";
                }
            }
            
            displayTitle = displayTitle.replace(/_/g, " ");
            
            // Determine category
            let category = "photos";
            if (title.toLowerCase().includes("julkasut")) {
                category = "list";
            } else if (title.toLowerCase().includes("spot")) {
                category = "spotify";
            } else if (title.toLowerCase().includes("räppicord") || title.toLowerCase().includes("rappicord")) {
                category = "events";
            }
            
            const displayDate = formatDate(date);
            const imagePath = `../images/galleria/output/${filename}`;
            
            addGalleryItem({
                type: category,
                date: date,
                title: displayTitle,
                index: index,
                imagePath: imagePath,
                displayDate: displayDate,
                isVideo: false
            });
        });
    }
    
    function processVideos() {
        const videos = [
            { id: "e8ctwxrfRl8", title: "MELO - ylpee must (snippet)", date: "2023-12-18" },
            // Add more videos as needed
        ];
        
        videos.forEach((video, index) => {
            const date = new Date(video.date);
            const displayDate = formatDate(date);
            
            addGalleryItem({
                type: "videos",
                date: date,
                title: video.title,
                index: index,
                videoId: video.id,
                displayDate: displayDate,
                isVideo: true
            });
        });
    }
    
    function addGalleryItem(item) {
        let html;
        
        if (item.isVideo) {
            html = `
                <div class="gallery-item videos" data-date="${item.date.getTime()}" data-index="${item.index}">
                    <div class="video-placeholder" data-video-id="${item.videoId}">
                        <img src="https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg" alt="${item.title}">
                        <div class="play-button"></div>
                    </div>
                    <div class="gallery-caption">
                        <h3>${item.title}</h3>
                        <p>${item.displayDate}</p>
                    </div>
                </div>
            `;
        } else {
            html = `
                <div class="gallery-item ${item.type}" data-date="${item.date.getTime()}" data-index="${item.index}">
                    <div class="gallery-image-container">
                        <img src="${item.imagePath}" alt="${item.title}" data-fullsize="${item.imagePath}" onerror="this.parentNode.parentNode.style.display='none'">
                    </div>
                    <div class="gallery-caption">
                        <h3>${item.title}</h3>
                        <p>${item.displayDate}</p>
                    </div>
                </div>
            `;
        }
        
        galleryData.push({
            type: item.type,
            date: item.date,
            title: item.title,
            index: item.index,
            html: html,
            imagePath: item.isVideo ? null : item.imagePath
        });
    }
    
    function renderGallery() {
        galleryGrid.innerHTML = galleryData.map(item => item.html).join('');
    }
    
    // UTILITY FUNCTIONS
    function formatDate(date) {
        if (!date || isNaN(date.getTime())) {
            return "Invalid date";
        }
        
        return date.toLocaleDateString('fi-FI', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
    }
    
    // EVENT HANDLERS
    function setupImageClicks() {
        const galleryImages = document.querySelectorAll('.gallery-image-container img');
        
        galleryImages.forEach(img => {
            img.addEventListener('click', function() {
                const fullsizeUrl = this.getAttribute('data-fullsize');
                const altText = this.getAttribute('alt');
                
                createImageModal(fullsizeUrl, altText);
            });
        });
    }
    
    function createImageModal(imageUrl, caption) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <span class="close-image">&times;</span>
                <img src="${imageUrl}" alt="${caption}">
                <div class="image-caption">${caption}</div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add click event to close button
        const closeButton = modal.querySelector('.close-image');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close modal when clicking outside the image
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target === closeButton) {
                document.body.removeChild(modal);
            }
        });
        
        // Don't close modal when clicking on the image itself
        modal.querySelector('.image-modal-content img').addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    function setupVideoClicks() {
        const videoPlaceholders = document.querySelectorAll('.video-placeholder');
        videoPlaceholders.forEach(placeholder => {
            placeholder.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                const videoTitle = this.closest('.gallery-item').querySelector('.gallery-caption h3').textContent || 'Video';
                
                createVideoModal(videoId, videoTitle);
            });
        });
    }
    
    function createVideoModal(videoId, videoTitle) {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <span class="close-video">&times;</span>
                <div class="video-container">
                    <div class="video-container-inner">
                        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&controls=1" 
                            frameborder="0" allowfullscreen
                            allow="autoplay; encrypted-media; picture-in-picture">
                        </iframe>
                    </div>
                </div>
                <div class="video-caption">${videoTitle}</div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Handle closing the modal
        const closeButton = modal.querySelector('.close-video');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Close modal when clicking outside content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
});
