function logout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userContact');
        window.location.href = 'HomePage.html';
    }
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
window.addEventListener('load', async function() {
    const userEmail = localStorage.getItem('userEmail');
    const loggedIn = localStorage.getItem('loggedIn');

    if (userEmail && loggedIn === 'user') {
        // Fetch user info from backend
        try {
            const response = await fetch(`http://localhost:5000/user/${userEmail}`);
            const userData = await response.json();
            if (response.ok) {
                document.getElementById('userName').textContent = userData.name;
                document.getElementById('userEmail').textContent = userEmail;
                document.getElementById('userContact').textContent = userData.contact;
            } else {
                console.error('Error fetching user info:', userData.error);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }

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
    document.getElementById('confirmBtn').addEventListener('click', async function() {
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

        // Send reservation to backend
        try {
            const response = await fetch('http://localhost:5000/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    startTime: startTime,
                    endTime: endTime,
                    startDate: startDate,
                    endDate: endDate
                })
            });
            const result = await response.json();
            if (result.success) {
                alert('Your reservation is confirmed. Please wait for our admin to approve it. You will receive an email to inform you that your reservation is approved. Thank you for choosing our service!');
                window.location.href = 'HomePage.html';
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error submitting reservation. Please try again.');
        }
    });
});
