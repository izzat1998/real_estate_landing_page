// Video Tour Component
document.addEventListener('DOMContentLoaded', function() {
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const propertyVideo = document.getElementById('propertyVideo');
    
    // Hide iframe initially
    if (propertyVideo) {
        propertyVideo.style.display = 'none';
    }
    
    // Click handler for video placeholder
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // Set video source - replace this with your actual video URL
            propertyVideo.src = 'https://www.youtube.com/embed/pOmuzTDGCjU?autoplay=1';
            
            // Show iframe and hide placeholder
            propertyVideo.style.display = 'block';
            videoPlaceholder.style.display = 'none';
        });
    }
});
