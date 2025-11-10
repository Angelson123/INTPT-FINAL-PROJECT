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
        const [pendingRes, approvedRes, declinedRes] = await Promise.all([
            fetch('http://localhost:5000/reservations/pending').then(r => r.json()),
            fetch('http://localhost:5000/reservations/approved').then(r => r.json()),
            fetch('http://localhost:5000/reservations/declined').then(r => r.json())
        ]);

        const pendingContainer = document.getElementById('pendingReservations');
        const approvedContainer = document.getElementById('approvedReservations');
        const declinedContainer = document.getElementById('declinedReservations');

        pendingContainer.innerHTML = '';
        approvedContainer.innerHTML = '';
        declinedContainer.innerHTML = '';

        pendingRes.forEach((res, index) => {
            const item = document.createElement('div');
            item.className = 'reservation-item';
            item.innerHTML = `
                <p>Name: ${res.name}</p>
                <p>Email: ${res.email}</p>
                <p>Contact No.: ${res.contact}</p>
                <p>Start Time: ${formatTime(res.startTime)}</p>
                <p>End Time: ${formatTime(res.endTime)}</p>
                <p>Start Date: ${res.startDate}</p>
                <p>End Date: ${res.endDate}</p>
                <div class="button-group">
                    <button class="agree-btn" onclick="approveReservation(${index})">Agree</button>
                    <button class="decline-btn" onclick="declineReservation(${index})">Decline</button>
                </div>
            `;
            pendingContainer.appendChild(item);
        });

        approvedRes.forEach((res, index) => {
            const item = document.createElement('div');
            item.className = 'reservation-item';
            item.innerHTML = `
                <p>Name: ${res.name}</p>
                <p>Email: ${res.email}</p>
                <p>Contact No.: ${res.contact}</p>
                <p>Start Time: ${formatTime(res.startTime)}</p>
                <p>End Time: ${formatTime(res.endTime)}</p>
                <p>Start Date: ${res.startDate}</p>
                <p>End Date: ${res.endDate}</p>
                <button class="delete-btn" onclick="deleteApproved(${index})">Delete</button>
            `;
            approvedContainer.appendChild(item);
        });

        declinedRes.forEach((res, index) => {
            const item = document.createElement('div');
            item.className = 'reservation-item';
            item.innerHTML = `
                <p>Name: ${res.name}</p>
                <p>Email: ${res.email}</p>
                <p>Contact No.: ${res.contact}</p>
                <p>Start Time: ${formatTime(res.startTime)}</p>
                <p>End Time: ${formatTime(res.endTime)}</p>
                <p>Start Date: ${res.startDate}</p>
                <p>End Date: ${res.endDate}</p>
                <button class="delete-btn" onclick="deleteDeclined(${index})">Delete</button>
            `;
            declinedContainer.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading reservations:', error);
    }
}

async function approveReservation(index) {
    try {
        await fetch(`http://localhost:5000/reservations/approve/${index}`, { method: 'POST' });
        loadReservations();
    } catch (error) {
        console.error('Error approving reservation:', error);
    }
}

async function declineReservation(index) {
    try {
        await fetch(`http://localhost:5000/reservations/decline/${index}`, { method: 'POST' });
        loadReservations();
    } catch (error) {
        console.error('Error declining reservation:', error);
    }
}

async function deleteApproved(index) {
    try {
        await fetch(`http://localhost:5000/reservations/approved/${index}`, { method: 'DELETE' });
        loadReservations();
    } catch (error) {
        console.error('Error deleting approved reservation:', error);
    }
}

async function deleteDeclined(index) {
    try {
        await fetch(`http://localhost:5000/reservations/declined/${index}`, { method: 'DELETE' });
        loadReservations();
    } catch (error) {
        console.error('Error deleting declined reservation:', error);
    }
}

window.addEventListener('load', loadReservations);
