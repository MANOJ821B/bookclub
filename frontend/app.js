document.addEventListener('DOMContentLoaded', () => {
    const clubList = document.getElementById('club-list');

    // Fetch book clubs from the backend (mocked data here)
    const clubs = [
        { name: 'Sci-Fi Enthusiasts', description: 'Exploring the universe of sci-fi books.' },
        { name: 'Mystery Lovers', description: 'Dive into thrilling mystery novels.' }
    ];

    // Populate the club list
    clubs.forEach(club => {
        const li = document.createElement('li');
        li.textContent = `${club.name}: ${club.description}`;
        clubList.appendChild(li);
    });
});

