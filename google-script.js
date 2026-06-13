let scrollInterval;

function initMap() {
    const placeId = 'ChIJn9JCuI7jDDkRM3BPNWTEATc';
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.getDetails({
        placeId: placeId,
        fields: ['name', 'rating', 'user_ratings_total', 'reviews']
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayTotalReviews(place);
            displayReviews(place.reviews);
            autoScrollReviews();
        }
    });
}
function truncateToWordLimit(text, limit = 40) { // Default limit set to 10
    const words = text.split(/\s+/); // Split the text into words
    if (words.length > limit) {
        return words.slice(0, limit).join(' ') + '...'; // Truncate and add ellipsis
    }
    return text;
}

function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = ''; // Clear previous reviews
    reviews.forEach(review => {
        const reviewText = truncateToWordLimit(review.text); // Truncate review text to 10 words
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <h3>${review.author_name}</h3>
            <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            <p>${reviewText}</p>
        `;
        reviewsContainer.appendChild(reviewCard);
    });
}

function displayTotalReviews(place) {
    const totalReviewsDiv = document.getElementById('total-reviews');
    const rating = place.rating;
    const starsFull = '★'.repeat(Math.floor(rating));
    const starHalf = (rating % 1) >= 0.5 ? '' : '';
    const starsEmpty = '☆'.repeat(5 - Math.ceil(rating));
    totalReviewsDiv.innerHTML = `<h4>Total Rating: ${rating.toFixed(1)} ${starsFull}${starHalf}${starsEmpty} (${place.user_ratings_total} reviews)</h4>`;
}




function autoScrollReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    scrollInterval = setInterval(() => {
        if (reviewsContainer.scrollWidth !== reviewsContainer.clientWidth) {
            reviewsContainer.scrollLeft += 1;
            if (reviewsContainer.scrollLeft >= (reviewsContainer.scrollWidth - reviewsContainer.clientWidth)) {
                reviewsContainer.scrollLeft = 0;
            }
        }
    }, 30);
    console.log('Auto-scroll started');
}


function stopScrollReviews() {
    clearInterval(scrollInterval);
    console.log('Auto-scroll stopped');
}

function manualScroll(amount) {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.scrollLeft += amount;
}

document.addEventListener('DOMContentLoaded', function() {
    const reviewsContainer = document.getElementById('reviews-container');

    reviewsContainer.addEventListener('mouseenter', function() {
        stopScrollReviews();
        console.log('Mouse entered reviews container');
    });

    reviewsContainer.addEventListener('mouseleave', function() {
        autoScrollReviews();
        console.log('Mouse left reviews container');
    });
});

// Load the Google Maps script and call initMap when it's loaded
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAHCVnB95EvKJtZAYksVD4f7tXb7VZfkXc&libraries=places&callback=initMap`;
script.async = true;
script.defer = true;
document.head.appendChild(script);


document.getElementById('write-review-btn').addEventListener('click', function() {
    document.getElementById('write-review-form').scrollIntoView({ behavior: 'smooth' });
});