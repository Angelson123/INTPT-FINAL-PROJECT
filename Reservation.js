function logout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = 'HomePage.html';
    }
}

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

    if (currentMonthDate <= currentDate) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
    nextBtn.disabled = false;
}

window.addEventListener('load', async function() {
    const userEmail = localStorage.getItem('userEmail');
    const loggedIn = localStorage.getItem('loggedIn');

    if (userEmail && loggedIn === 'user') {
        try {
            const response = await fetch(`http://localhost:5000/user/${userEmail}`);
            const userData = await response.json();
            if (response.ok) {
                document.getElementById('userName').textContent = userData.name;
                document.getElementById('userEmail').textContent = userEmail;
                document.getElementById('userContact').textContent = userData.contact;
            } else {
                console.error('Error:', userData.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        document.getElementById('startTime').disabled = false;
        document.getElementById('endTime').disabled = false;
        document.getElementById('startDate').disabled = false;
        document.getElementById('endDate').disabled = false;
        document.getElementById('confirmBtn').disabled = false;

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').setAttribute('min', today);
        document.getElementById('endDate').setAttribute('min', today);
    } else {
        document.getElementById('startTime').disabled = true;
        document.getElementById('endTime').disabled = true;
        document.getElementById('startDate').disabled = true;
        document.getElementById('endDate').disabled = true;
        document.getElementById('confirmBtn').disabled = true;
    }

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
                alert('Your reservation is confirmed. Please wait for our admin to approve it.');
                window.location.href = 'HomePage.html';
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error submitting reservation. Please try again.');
        }
    });
});
