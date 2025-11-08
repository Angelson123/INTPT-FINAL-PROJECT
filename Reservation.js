function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userContact');
    window.location.href = 'HomePage.html';
}

// Month navigation logic
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

function updateMonthDisplay() {
    const monthDisplay = document.getElementById('currentMonth');
    if (monthDisplay) {
        monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
}

function prevMonth() {
    const currentDate = new Date();
    const currentMonthDate = new Date(currentYear, currentMonth);
    if (currentMonthDate > currentDate) {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateMonthDisplay();
        updateArrowStates();
    }
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateMonthDisplay();
    updateArrowStates();
}

function updateArrowStates() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const currentDate = new Date();
    const currentMonthDate = new Date(currentYear, currentMonth);

    // Disable prev if current month is the current month
    if (currentMonthDate <= currentDate) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    // Next is always enabled for future months
    nextBtn.disabled = false;
}

// Display user info on page load and enable/disable fields based on login status
window.addEventListener('load', function() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userContact = localStorage.getItem('userContact');
    const loggedIn = localStorage.getItem('loggedIn');

    if (userName) document.getElementById('userName').textContent = userName;
    if (userEmail) document.getElementById('userEmail').textContent = userEmail;
    if (userContact) document.getElementById('userContact').textContent = userContact;

    if (loggedIn) {
        // Enable fields if logged in
        document.getElementById('startTime').disabled = false;
        document.getElementById('endTime').disabled = false;
        document.getElementById('startDate').disabled = false;
        document.getElementById('endDate').disabled = false;
        document.getElementById('confirmBtn').disabled = false;

        // Set minimum date for date inputs to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').setAttribute('min', today);
        document.getElementById('endDate').setAttribute('min', today);
    } else {
        // Fields remain disabled if not logged in
        document.getElementById('startTime').disabled = true;
        document.getElementById('endTime').disabled = true;
        document.getElementById('startDate').disabled = true;
        document.getElementById('endDate').disabled = true;
        document.getElementById('confirmBtn').disabled = true;
    }

    // Add event listener for confirm button
    document.getElementById('confirmBtn').addEventListener('click', function() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;

        if (!startDate || !endDate || !startTime || !endTime) {
            alert('Please fill all the fields.');
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            alert('End date cannot be before start date.');
            return;
        }

        // If all validations pass
        alert('Reservation confirmed!');
    });
});
