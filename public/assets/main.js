// Constants
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMAGE = '/assets/images/no-image.jpg';

// Replace the config import with direct constants
const config = {
    apiKey: __API_KEY__,
    accessToken: __ACCESS_TOKEN__
};

// Movie data
const movieData = {
    movies: [
        {
            title: "Athadu",
            poster_path: "Athadu.jpg", 
            vote_average: 8.5,
            quality: "4K",
            description: "A professional killer's life changes after being falsely accused of killing a politician."
        },
        {
            title: "Atharintiki Daaredi",
            poster_path: "Atharintiki Daaredi.jpg",
            vote_average: 8.2,
            quality: "4K", 
            description: "A grandson tries to reunite his father and grandmother."
        },
        {
            title: "DJ Tillu",
            poster_path: "dj tillu.jpg",
            vote_average: 7.8,
            quality: "4K",
            description: "A DJ gets entangled in a crime investigation."
        },
        {
            title: "EEGA",
            poster_path: "EEGA.jpg",
            vote_average: 8.4,
            quality: "4K",
            description: "A man reincarnated as a fly seeks revenge against his killer."
        },
        {
            title: "Vedam",
            poster_path: "Vedam.jpg",
            vote_average: 8.3,
            quality: "4K",
            description: "Five different people's lives intersect during a terrorist attack."
        }
    ]
}; 