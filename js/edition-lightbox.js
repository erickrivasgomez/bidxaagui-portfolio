// Add this to your existing edition-lightbox.js
document.addEventListener('DOMContentLoaded', function() {
    // Existing lightbox initialization code...
    
    // Add click handler for "Leer" buttons
    document.querySelectorAll('.btn-read').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const editionId = this.getAttribute('data-edition-id');
            if (editionId) {
                // Open the public preview in a new window
                const url = `${window.location.origin}/public/editions/${editionId}/preview`;
                const width = window.innerWidth * 0.9;
                const height = window.innerHeight * 0.9;
                const left = (window.innerWidth - width) / 2;
                const top = (window.innerHeight - height) / 2;
                
                window.open(
                    url,
                    'editionPreview',
                    `width=${Math.floor(width)},height=${Math.floor(height)},top=${Math.floor(top)},left=${Math.floor(left)},resizable=yes,scrollbars=yes`
                );
            }
        });
    });
});
