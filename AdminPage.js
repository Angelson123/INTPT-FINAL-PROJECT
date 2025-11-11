function logout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('loggedIn');
        window.location.href = 'HomePage.html';
    }
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

async function loadReservations() {
    try {
        const res = await fetch('http://localhost:5000/reservations/pending').then(r => r.json());
        const container = document.getElementById('pendingReservations');
        container.innerHTML = '';
        res.forEach((r, index) => {
            const item = document.createElement('div');
            item.className = 'reservation-item';
            item.innerHTML = `
                <p>Name: ${r.name}</p>
                <p>Email: ${r.email}</p>
                <p>Contact No.: ${r.contact}</p>
                <p>Start Time: ${formatTime(r.startTime)}</p>
                <p>End Time: ${formatTime(r.endTime)}</p>
                <p>Start Date: ${r.startDate}</p>
                <p>End Date: ${r.endDate}</p>
                <div class="button-group">
                    <button class="agree-btn" onclick="approve(${index})">Agree</button>
                    <button class="decline-btn" onclick="decline(${index})">Decline</button>
                </div>
            `;
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function approve(index) {
    try {
        await fetch(`http://localhost:5000/reservations/approve/${index}`, { method: 'POST' });
        loadReservations();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function decline(index) {
    try {
        await fetch(`http://localhost:5000/reservations/decline/${index}`, { method: 'POST' });
        loadReservations();
    } catch (error) {
        console.error('Error:', error);
    }
}

window.addEventListener('load', loadReservations);
