// Store users in localStorage
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

let currentUser = null;

function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('questionnaire').classList.add('hidden');
    document.getElementById('matches').classList.add('hidden');
}

function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('questionnaire').classList.add('hidden');
    document.getElementById('matches').classList.add('hidden');
}

function showQuestionnaire() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('questionnaire').classList.remove('hidden');
    document.getElementById('matches').classList.add('hidden');
}

function showMatches() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('questionnaire').classList.add('hidden');
    document.getElementById('matches').classList.remove('hidden');
    displayMatches();
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        showMatches();
    } else {
        alert('Invalid credentials');
    }
    return false;
}

function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    if (users.some(u => u.email === email)) {
        alert('Email already exists');
        return false;
    }
    
    currentUser = { email, password };
    showQuestionnaire();
    return false;
}

function handleQuestionnaire(event) {
    event.preventDefault();
    const form = event.target;
    const preferences = {
        sleepTime: form.sleepTime.value,
        cleanliness: form.cleanliness.value,
        guests: form.guests.value,
        noise: form.noise.value
    };
    
    const users = JSON.parse(localStorage.getItem('users'));
    const newUser = {
        ...currentUser,
        preferences
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    showMatches();
    return false;
}

function calculateCompatibility(user1, user2) {
    let score = 0;
    const p1 = user1.preferences;
    const p2 = user2.preferences;
    
    if (p1.sleepTime === p2.sleepTime) score += 25;
    if (p1.cleanliness === p2.cleanliness) score += 25;
    if (p1.guests === p2.guests) score += 25;
    if (p1.noise === p2.noise) score += 25;
    
    return score;
}

function displayMatches() {
    const users = JSON.parse(localStorage.getItem('users'));
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';
    
    const potentialMatches = users
        .filter(user => user.email !== currentUser.email)
        .map(user => ({
            ...user,
            compatibility: calculateCompatibility(currentUser, user)
        }))
        .sort((a, b) => b.compatibility - a.compatibility);
    
    potentialMatches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <h3>${match.compatibility}% Compatible</h3>
            <p>Email: ${match.email}</p>
            <p>Sleep Time: ${match.preferences.sleepTime}</p>
            <p>Cleanliness: ${match.preferences.cleanliness}</p>
            <p>Guests: ${match.preferences.guests}</p>
            <p>Noise Preference: ${match.preferences.noise}</p>
        `;
        matchesList.appendChild(matchCard);
    });
}

function logout() {
    currentUser = null;
    showLogin();
}

// Initialize view
showLogin();