document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const movieListElement = document.getElementById('movie-list');

    let userSelections = {};

    // --- MOVIE DATA based on your flowchart ---
    // M: age 12-16, B: age 16-22
    // K: know genre, D: don't know genre
    // Ye: yes, No: no
    const movieRecommendations = {
        "12-16": { // M
            "yes": { // K & Ye
                "action": ["Karate Kid"], // A
                "comedy_turbo": ["Turbo"], // C (differentiated)
                "mystery": ["Dora"], // M
                "sci-fi_narnia": ["Narnia"], // S (differentiated)
                "musical": ["High School Musical"] // U
            },
            "no": { // D (implicitly K & No)
                // W: do you want to watch comedy or sci-fi?
                "comedy": ["Parent Trap", "Zootropolis", "Lego Movie", "Ratatuy", "Ice Age"], // O
                "sci-fi": ["E.T.", "Treasure Planet", "Space Jam", "Back to the Future", "Zathura"] // Sc
            }
        },
        "16-22": { // B
            "yes": { // K & Ye
                "comedy_hangover": ["Hangover"], // Com
                "thriller": ["Carry On"], // Thr
                "rom-com_50first": ["50 First Kisses"], // Rc (differentiated)
                "period-drama": ["Little Women"], // Pd
                "horror_ash": ["Ash"], // Hor (differentiated)
                "mystery_death": ["Death on the Nile"], // My (differentiated)
                "murder": ["Zodiac"] // Mur
            },
            "no": { // D (implicitly K & No)
                // Rch: do you want to watch rom-com, comedy or horror?
                "rom-com": ["How to Lose a Guy in Ten Days", "Proposal", "Mamma Mia", "Crazy Stupid Love", "Blended"], // Rom
                "comedy": ["The Fall Guy", "Super Bad", "Two White Chicks", "Deadpool", "No Hard Feelings"], // Com (this path)
                "horror": ["It", "Annabelle", "Don't Move", "The Conjuring", "Us"] // Hor (this path)
            }
        }
    };

    function showScreen(screenId) {
        screens.forEach(screen => screen.classList.remove('active'));
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) {
            activeScreen.classList.add('active');
        } else {
            console.error("Screen not found:", screenId);
        }
    }

    function resetApp() {
        userSelections = {};
        movieListElement.innerHTML = '';
        showScreen('start-screen');
    }

    function displayMovies(movies) {
        movieListElement.innerHTML = ''; // Clear previous list
        if (movies && movies.length > 0) {
            movies.forEach(movie => {
                const li = document.createElement('li');
                li.textContent = movie;
                movieListElement.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "Sorry, no specific recommendations for this path right now. Try other options!";
            movieListElement.appendChild(li);
        }
        showScreen('results-screen');
    }

    function getRecommendations() {
        const age = userSelections.age;
        const knowsGenre = userSelections.knowsGenre;
        const genre = userSelections.genre; // This could be main genre or sub-genre

        if (!age) return []; // Should not happen if flow is correct

        const ageBranch = movieRecommendations[age];
        if (!ageBranch) return [];

        if (knowsGenre === "yes") {
            return ageBranch.yes[genre] || [];
        } else if (knowsGenre === "no") {
            return ageBranch.no[genre] || [];
        }
        return [];
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', () => {
        showScreen('age-question-screen');
    });

    restartButton.addEventListener('click', resetApp);

    // General handler for all choice buttons
    document.getElementById('app-content').addEventListener('click', (event) => {
        if (event.target.classList.contains('choice-button')) {
            const button = event.target;
            const currentScreen = button.closest('.screen');
            const choice = button.dataset.choice;

            // Visual feedback: temporary class or style change
            button.style.transform = 'scale(0.95)';
            setTimeout(() => button.style.transform = 'scale(1)', 150);


            if (currentScreen.id === 'age-question-screen') {
                userSelections.age = choice;
                showScreen('genre-knowledge-screen');
            } 
            else if (currentScreen.id === 'genre-knowledge-screen') {
                userSelections.knowsGenre = choice;
                if (choice === 'yes') {
                    if (userSelections.age === '12-16') {
                        showScreen('genre-choice-12-16-yes-screen');
                    } else { // 16-22
                        showScreen('genre-choice-16-22-yes-screen');
                    }
                } else { // 'no'
                    if (userSelections.age === '12-16') {
                        showScreen('subgenre-choice-12-16-no-screen');
                    } else { // 16-22
                        showScreen('subgenre-choice-16-22-no-screen');
                    }
                }
            } 
            else if (currentScreen.id === 'genre-choice-12-16-yes-screen' || 
                     currentScreen.id === 'subgenre-choice-12-16-no-screen' ||
                     currentScreen.id === 'genre-choice-16-22-yes-screen' ||
                     currentScreen.id === 'subgenre-choice-16-22-no-screen') {
                userSelections.genre = choice; // This stores the final genre/sub-genre choice
                const movies = getRecommendations();
                displayMovies(movies);
            }
        }
    });

    // Initial setup
    resetApp(); // Start with the first screen
});