// Constants
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMAGE = 'assets/images/no-image.jpg';

// Replace the config import with direct constants
const config = {
    apiKey: __API_KEY__,
    accessToken: __ACCESS_TOKEN__
};

// Movie data by language
const movieData = {
    telugu: [
        {
            title: "Athadu",
            poster_path: "Athadu.jpg", 
            vote_average: 8.5,
            quality: "4K",
            description: "A professional killer's life changes after being falsely accused of killing a politician.",
            language: "telugu"
        },
        {
            title: "Atharintiki Daaredi",
            poster_path: "Atharintiki Daaredi.jpg",
            vote_average: 8.2,
            quality: "4K", 
            description: "A grandson tries to reunite his father and grandmother.",
            language: "telugu"
        },
        {
            title: "DJ Tillu",
            poster_path: "dj tillu.jpg",
            vote_average: 7.8,
            quality: "4K",
            description: "A DJ gets entangled in a crime investigation.",
            language: "telugu"
        },
        {
            title: "EEGA",
            poster_path: "EEGA.jpg",
            vote_average: 8.4,
            quality: "4K",
            description: "A man reincarnated as a fly seeks revenge against his killer.",
            language: "telugu"
        },
        {
            title: "Vedam",
            poster_path: "Vedam.jpg",
            vote_average: 8.3,
            quality: "4K",
            description: "Five different people's lives intersect during a terrorist attack.",
            language: "telugu"
        }
    ],
    english: [] // Will be populated from API
};

// App state
let currentLanguage = 'telugu';

// UI Components
class MovieUI {
    static createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        let imagePath;
        if (movie.language === 'english') {
            imagePath = movie.poster_path 
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : FALLBACK_IMAGE;
        } else {
            imagePath = `assets/images/${movie.poster_path}`;
        }
        
        console.log('Creating card for:', movie.title, 'with image:', imagePath);
        
        movieCard.innerHTML = `
            <div class="quality-tag">${movie.quality || 'HD'}</div>
            <img src="${imagePath}" 
                 alt="${movie.title}"
                 onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}'"
                 style="width: 100%; height: auto;">
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
        if (!container) return;
        container.innerHTML = '';
        movies.forEach(movie => {
            container.appendChild(MovieUI.createMovieCard(movie));
        });
    }

    static openModal(movie) {
        const modal = document.getElementById('watchModal');
        if (!modal) return;

        // Update modal content
        modal.querySelector('.movie-title').textContent = movie.title;
        modal.querySelector('.quality').textContent = movie.quality || 'HD';
        modal.querySelector('.rating').innerHTML = 
            `<i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}`;
        modal.querySelector('.year').textContent = 
            movie.release_date ? movie.release_date.split('-')[0] : '2024';
        modal.querySelector('.description').textContent = 
            movie.description || movie.overview;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    static closeModal() {
        const modal = document.getElementById('watchModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Page Manager
class PageManager {
    static moviesPerPage = 20;
    static currentPage = 1;

    static loadPage(page) {
        const movies = [...(movieData.telugu || []), ...(movieData.english || [])];
        const trending = movies.filter(m => m.vote_average >= 7.5);
        
        console.log('Loading page:', page);
        console.log('Total movies available:', movies.length);
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.moviesPerPage;
        const endIndex = startIndex + this.moviesPerPage;
        const paginatedMovies = movies.slice(startIndex, endIndex);
        
        const container = document.querySelector(`#${page}-page`);
        if (!container) return;

        switch(page) {
            case 'home':
                // Show trending in hero section
                const heroMovie = trending[Math.floor(Math.random() * trending.length)];
                if (heroMovie) {
                    this.updateHeroSection(heroMovie);
                }
                
                // Display featured movies (latest)
                MovieUI.displayMovies(
                    movies.slice(0, 12), // Show first 12 movies
                    container.querySelector('.featured .movie-grid')
                );
                
                // Display trending movies
                MovieUI.displayMovies(
                    trending.slice(0, 12), // Show first 12 trending movies
                    container.querySelector('.trending .movie-grid')
                );
                break;

            case 'movies':
                MovieUI.displayMovies(
                    paginatedMovies,
                    container.querySelector('.all-movies .movie-grid')
                );
                this.updatePagination(movies.length);
                break;

            case 'trending':
                MovieUI.displayMovies(
                    trending,
                    container.querySelector('.trending-all .movie-grid')
                );
                break;
        }
    }

    static updateHeroSection(movie) {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const backdropPath = movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : 'assets/images/default-hero.jpg';

        hero.style.backgroundImage = `
            linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
            url('${backdropPath}')
        `;

        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.innerHTML = `
                <h1>${movie.title}</h1>
                <p>${movie.overview || movie.description}</p>
                <button class="watch-now" onclick="MovieUI.openModal(${JSON.stringify(movie)})">
                    Watch Now
                </button>
            `;
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

    static getCurrentPage() {
        const activePage = document.querySelector('.page.active');
        return activePage ? activePage.id.replace('-page', '') : 'home';
    }
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

async function testApiKey() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/now_playing?api_key=${config.apiKey}`
        );
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Key Status: Working');
            console.log(`📊 Total Movies: ${data.total_results}`);
            console.log(`📑 Total Pages: ${data.total_pages}`);
            console.log(`🎬 Movies per page: ${data.results.length}`);
            console.log(`📅 Date range: ${data.dates.minimum} to ${data.dates.maximum}`);
        } else {
            console.error('❌ API Key is not working!');
            console.error(`Status: ${response.status}`);
            const error = await response.json();
            console.error('Error details:', error);
        }
    } catch (error) {
        console.error('❌ Error testing API:', error);
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded');
    
    // Test API key first
    await testApiKey();
    
    // Fetch English movies from TMDB
    const englishMovies = await fetchEnglishMovies();
    console.log('Fetched English movies:', englishMovies.length);
    movieData.english = englishMovies;
    
    // Initialize components
    initializeNavigation();
    initializeLanguageSelector();
    
    // Load initial page
    PageManager.loadPage('home');

    // Modal event listeners
    const modal = document.getElementById('watchModal');
    const closeButton = document.querySelector('.close-modal');
    
    if (closeButton) {
        closeButton.addEventListener('click', MovieUI.closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) MovieUI.closeModal();
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            MovieUI.closeModal();
        }
    });
});