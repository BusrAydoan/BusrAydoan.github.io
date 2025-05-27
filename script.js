document.addEventListener('DOMContentLoaded', () => {
    const steps = {
        season: document.getElementById('step1-season'),
        tripType: document.getElementById('step2-trip-type'),
        duration: document.getElementById('step3-duration'),
        results: document.getElementById('results')
    };

    const activityListElement = document.getElementById('activity-list');
    const resetButton = document.getElementById('reset-button');

    let userChoices = {
        season: null,
        tripType: null,
        duration: null
    };

    // Activity data based on the flowchart
    const activitiesData = {
        summer: {
            relaxing: {
                half: ["Re-reading your favorite book by the sea", "Relaxing by the pool", "Swimming"],
                full: ["Renting a boat", "Taking a workshop", "Whale watching"]
            },
            adventure: {
                half: ["Biking", "Surfing", "Hot air balloon ride"],
                full: ["Hiking", "Safari", "Camping", "Kayaking"]
            },
            cultural: {
                half: ["Visit a museum", "Go to the historical places"],
                full: ["Camp at a local place", "Explore the non-touristic places"]
            }
        },
        winter: {
            relaxing: {
                half: ["Building a snowman", "Reading a book at the terrace", "Dinner by the mountain"],
                full: ["Ice skating", "Ice fishing", "Go to a hockey game"]
            },
            adventure: {
                half: ["Fat biking", "Trekking", "Skiing"],
                full: ["Ice climbing", "Snowmobiling", "Stay in a yurt"]
            },
            cultural: {
                half: ["Dinner at a local diner", "Go to a church"],
                full: ["Explore non-touristic places", "Taste their cuisine", "Camp"] // Note: "Camp" appears in winter cultural full day
            }
        }
    };

    function showStep(stepId) {
        Object.values(steps).forEach(stepDiv => stepDiv.classList.remove('current-step'));
        if (steps[stepId]) {
            steps[stepId].classList.add('current-step');
        }
    }

    function handleChoice(stepKey, choice, nextStepId) {
        userChoices[stepKey] = choice;

        // Visual feedback: remove 'selected' from siblings, add to current
        const currentStepButtons = steps[stepKey].querySelectorAll('button');
        currentStepButtons.forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');


        // Delay slightly before showing next step for smoother transition
        setTimeout(() => {
            if (nextStepId) {
                showStep(nextStepId);
            } else {
                displayResults();
            }
        }, 300); // 300ms delay
    }

    function displayResults() {
        activityListElement.innerHTML = ''; // Clear previous results
        const { season, tripType, duration } = userChoices;

        if (season && tripType && duration &&
            activitiesData[season] &&
            activitiesData[season][tripType] &&
            activitiesData[season][tripType][duration]) {

            const recommendedActivities = activitiesData[season][tripType][duration];
            recommendedActivities.forEach(activity => {
                const li = document.createElement('li');
                li.textContent = activity;
                activityListElement.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "Sorry, we couldn't find activities for your selection. Please try again.";
            activityListElement.appendChild(li);
            console.error("Error: Could not find activities for choices:", userChoices);
        }
        showStep('results');
    }

    function resetApp() {
        userChoices = { season: null, tripType: null, duration: null };
        activityListElement.innerHTML = '';
        // Remove 'selected' class from all buttons
        document.querySelectorAll('.step button').forEach(btn => btn.classList.remove('selected'));
        showStep('season');
    }

    // Event Listeners for choices
    steps.season.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => handleChoice('season', e.target.dataset.choice, 'tripType'));
    });

    steps.tripType.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => handleChoice('tripType', e.target.dataset.choice, 'duration'));
    });

    steps.duration.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => handleChoice('duration', e.target.dataset.choice, null)); // null nextStepId triggers results
    });

    resetButton.addEventListener('click', resetApp);

    // Initialize: Show the first step
    showStep('season');
});