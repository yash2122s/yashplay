// Constants
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMAGE = '/public/assets/images/no-image.jpg';
const STREAM_URL = 'https://streamruby.com/';

// API Configuration
const config = {
    apiKey: '5bfab939b1721316a653757539b52cc4',
    accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmZhYjkzOWIxNzIxMzE2YTY1Mzc1NzUzOWI1MmNjNCIsIm5iZiI6MTczNDM2NDk1NS42MjQsInN1YiI6IjY3NjA0ZjFiY2RmY2NjYmE2ZmM0ZWYyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tWPEyzzDykuZogjns4GUwJ9oBmteE8Fnm0-YtkmgqT8'
};

// Movie data
const movieData = {
    movies: [], // English movies from API
    teluguMovies: [], // Telugu movies from API
    api: [] // Other API movies
};

// App state
let currentLanguage = 'telugu';

// UI Components
class MovieUI {
    static createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        let imagePath = movie.poster_path 
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : FALLBACK_IMAGE;
        
        console.log('Creating card for:', movie.title, 'with image:', imagePath);
        
        movieCard.innerHTML = `
            <div class="quality-tag">${movie.quality || 'HD'}</div>
            <img src="${imagePath}" 
                 alt="${movie.title}"
                 onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}'"
                 loading="lazy">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="movie-meta">
                    <span class="rating">
                        <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}
                    </span>
                    <span class="year">${movie.release_date ? movie.release_date.split('-')[0] : '2024'}</span>
                </div>
            </div>
        `;
        
        movieCard.addEventListener('click', () => MovieUI.openModal(movie));
        return movieCard;
    }

    static displayMovies(movies, container) {
        if (!container) {
            console.error('Container not found for displaying movies');
            return;
        }
        if (!Array.isArray(movies)) {
            console.error('Movies must be an array');
            return;
        }
        
        container.innerHTML = '';
        movies.forEach(movie => {
            try {
                container.appendChild(MovieUI.createMovieCard(movie));
            } catch (error) {
                console.error('Error creating movie card:', error);
            }
        });
    }

    static openModal(movie) {
        const modal = document.getElementById('watchModal');
        if (!modal) return;

        // Get video ID based on movie title
        const videoId = MovieUI.getVideoId(movie.title);

        modal.querySelector('.movie-title').textContent = movie.title;
        modal.querySelector('.quality').textContent = movie.quality || 'HD';
        modal.querySelector('.rating').innerHTML = 
            `<i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}`;
        modal.querySelector('.year').textContent = 
            movie.release_date ? movie.release_date.split('-')[0] : '2024';
        modal.querySelector('.description').textContent = 
            movie.description || movie.overview;

        // Add video player if ID exists
        const playerContainer = modal.querySelector('.video-container');
        if (videoId) {
            playerContainer.innerHTML = `
                <iframe 
                    src="${STREAM_URL}${videoId}"
                    allowfullscreen
                    frameborder="0"
                    width="100%"
                    height="400px">
                </iframe>
            `;
        } else {
            playerContainer.innerHTML = `
                <div class="player-placeholder">
                    <i class="fas fa-play-circle"></i>
                    <span>Video not available</span>
                </div>
            `;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add close handlers
        const closeButton = modal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', MovieUI.closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                MovieUI.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                MovieUI.closeModal();
            }
        });
    }

    static closeModal() {
        const modal = document.getElementById('watchModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Remove event listeners
        const closeButton = modal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.removeEventListener('click', MovieUI.closeModal);
        }

        modal.removeEventListener('click', MovieUI.closeModal);
        document.removeEventListener('keydown', MovieUI.closeModal);
    }

    static getVideoId(title) {
        // This would be your mapping of movie titles to StreamRuby video IDs
        const videoMap = {
            'Movie Title 1': 'video_id_1',
            'Movie Title 2': 'video_id_2',
            // Add more mappings as needed
        };
        return videoMap[title] || null;
    }
}

// Page Manager
class PageManager {
    static moviesPerPage = 20;
    static currentPage = 1;

    static loadPage(page) {
        const allMovies = [...movieData.api];
        const teluguMovies = [...movieData.teluguMovies];
        const trending = allMovies.filter(m => m.vote_average >= 7.5);
        
        console.log('Loading page:', page);
        console.log('Total movies available:', allMovies.length);
        console.log('Telugu movies available:', teluguMovies.length);
        
        const container = document.querySelector(`#${page}-page`);
        if (!container) return;

        switch(page) {
            case 'home':
                // Display Telugu movies section
                const teluguContainer = container.querySelector('.telugu-movies .movie-grid');
                if (teluguContainer) {
                    MovieUI.displayMovies(
                        teluguMovies.slice(0, 12),
                        teluguContainer
                    );
                }
                
                // Display other sections
                MovieUI.displayMovies(
                    allMovies.slice(0, 12),
                    container.querySelector('.featured .movie-grid')
                );
                
                MovieUI.displayMovies(
                    trending.slice(0, 12),
                    container.querySelector('.trending .movie-grid')
                );
                break;

            case 'movies':
                const startIndex = (this.currentPage - 1) * this.moviesPerPage;
                const endIndex = startIndex + this.moviesPerPage;
                const paginatedMovies = allMovies.slice(startIndex, endIndex);
                
                MovieUI.displayMovies(
                    paginatedMovies,
                    container.querySelector('.all-movies .movie-grid')
                );
                this.updatePagination(allMovies.length);
                break;

            case 'trending':
                MovieUI.displayMovies(
                    trending,
                    container.querySelector('.trending-all .movie-grid')
                );
                break;
        }
    }

    static updatePagination(totalMovies) {
        const totalPages = Math.ceil(totalMovies / this.moviesPerPage);
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        paginationContainer.innerHTML = `
            <button ${this.currentPage === 1 ? 'disabled' : ''} 
                onclick="PageManager.changePage(${this.currentPage - 1})">
                Previous
            </button>
            <span>Page ${this.currentPage} of ${totalPages}</span>
            <button ${this.currentPage === totalPages ? 'disabled' : ''} 
                onclick="PageManager.changePage(${this.currentPage + 1})">
                Next
            </button>
        `;
    }

    static changePage(newPage) {
        this.currentPage = newPage;
        this.loadPage('movies');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded');
    
    try {
        // Test API key first
        const apiWorking = await testApiKey();
        if (apiWorking) {
            // Fetch both English and Telugu movies
            const [apiMovies, teluguMovies] = await Promise.all([
                fetchEnglishMovies(),
                fetchTeluguMovies()
            ]);
            
            console.log('Fetched API movies:', apiMovies.length);
            console.log('Fetched Telugu movies:', teluguMovies.length);
            
            movieData.api = apiMovies;
            movieData.teluguMovies = teluguMovies;
        }

        // Initialize components
        initializeNavigation();
        
        // Load initial page
        const activePage = document.querySelector('.nav-link.active');
        if (activePage) {
            PageManager.loadPage(activePage.dataset.page);
        } else {
            PageManager.loadPage('home');
        }
        
    } catch (error) {
        console.error('Error initializing:', error);
    }
});

// Navigation initialization
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.dataset.page;

            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            link.classList.add('active');
            const targetElement = document.getElementById(`${targetPage}-page`);
            if (targetElement) {
                targetElement.classList.add('active');
                PageManager.loadPage(targetPage);
            }
        });
    });
}

// Event Handlers
function initializeLanguageSelector() {
    const languageSelect = document.querySelector('.language-select');
    if (!languageSelect) return;

    const languageOptions = document.createElement('div');
    languageOptions.className = 'language-options';
    languageOptions.innerHTML = `
        <div class="language-option" data-lang="telugu">Telugu</div>
        <div class="language-option" data-lang="english">English</div>
    `;
    languageOptions.style.display = 'none';
    languageSelect.appendChild(languageOptions);

    // Event Listeners
    languageSelect.addEventListener('click', (e) => {
        if (!e.target.closest('.language-option')) {
            languageOptions.style.display = 
                languageOptions.style.display === 'none' ? 'block' : 'none';
        }
    });

    languageOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.language-option');
        if (option) {
            currentLanguage = option.dataset.lang;
            languageSelect.querySelector('span').textContent = option.textContent;
            languageOptions.style.display = 'none';
            PageManager.loadPage(PageManager.getCurrentPage());
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-select')) {
            languageOptions.style.display = 'none';
        }
    });
}

async function fetchEnglishMovies(pages = 3) { // Fetch first 3 pages by default
    try {
        let allMovies = [];
        
        for (let page = 1; page <= pages; page++) {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/now_playing?api_key=${config.apiKey}&language=en-US&page=${page}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            const processedMovies = data.results.map(movie => ({
                title: movie.title,
                poster_path: movie.poster_path,
                overview: movie.overview,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                quality: movie.vote_average > 7 ? "4K" : "HD",
                description: movie.overview,
                language: "english"
            }));
            
            allMovies = [...allMovies, ...processedMovies];
        }
        
        console.log(`Fetched ${allMovies.length} movies total`);
        return allMovies;
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

async function fetchTeluguMovies() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${config.apiKey}&with_original_language=te&sort_by=popularity.desc&year=2019`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const processedMovies = data.results.map(movie => ({
            title: movie.title,
            poster_path: movie.poster_path,
            overview: movie.overview,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            quality: movie.vote_average > 7 ? "4K" : "HD",
            description: movie.overview,
            language: "telugu"
        }));
        
        console.log(`Fetched ${processedMovies.length} Telugu movies`);
        return processedMovies;
        
    } catch (error) {
        console.error('Error fetching Telugu movies:', error);
        return [];
    }
}

async function testApiKey() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/now_playing?api_key=${config.apiKey}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API key test successful');
        return true;
    } catch (error) {
        console.error('Error testing API key:', error);
        return false;
    }
}