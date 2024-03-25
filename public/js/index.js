document.addEventListener('DOMContentLoaded', function() {
    const loggedIn =  sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const homeButton = document.getElementById('homeButton');
    const buttonsContainer = document.getElementById('right-side-buttons');

    homeButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    if (loggedIn) {
        buttonsContainer.innerHTML = '';

        const dashboardButton = document.createElement('button');
        dashboardButton.textContent = 'Dashboard';
        dashboardButton.className = "text-white bg-transparent border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-500 transition duration-300";
        dashboardButton.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });

        buttonsContainer.appendChild(dashboardButton);
    } else {
        loginButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
        signupButton.addEventListener('click', function() {
            window.location.href = 'signup.html';
        });
    } 
});
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const content = item.querySelector('.accordion-item-content');

    checkbox.addEventListener('change', function () {
        if (this.checked) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });
});