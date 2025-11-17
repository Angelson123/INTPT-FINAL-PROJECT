window.addEventListener('load', function() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn !== 'user') {
        window.location.replace('LoginPage.html');
    } else {
        loadReservations();
    }
});

async function loadReservations() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
        alert('User not logged in');
        window.location.replace('LoginPage.html');
        return;
    }

    try {
        const approvedResponse = await fetch(`http://localhost:5000/user/${email}/approved`);
        const approvedReservations = approvedResponse.ok ? await approvedResponse.json() : [];

        const declinedResponse = await fetch(`http://localhost:5000/user/${email}/declined`);
        const declinedReservations = declinedResponse.ok ? await declinedResponse.json() : [];

        const pendingResponse = await fetch('http://localhost:5000/reservations/pending');
        const pendingReservations = pendingResponse.ok ? await pendingResponse.json() : [];
        const userPending = pendingReservations.filter(res => res.email === email);

        const allReservations = [
            ...approvedReservations.map(res => ({ ...res, status: 'approved' })),
            ...declinedReservations.map(res => ({ ...res, status: 'declined' })),
            ...userPending.map(res => ({ ...res, status: 'pending' }))
        ];

        displayReservations(allReservations);
    } catch (error) {
        console.error('Error loading reservations:', error);
        alert('Error loading reservations. Please try again.');
    }
}

function displayReservations(reservations) {
    const container = document.getElementById('reservations-list');
    container.innerHTML = '';

    if (reservations.length === 0) {
        container.innerHTML = '<p>No reservations found.</p>';
        return;
    }

    reservations.forEach(reservation => {
        const item = document.createElement('div');
        item.className = 'reservation-item';

        item.innerHTML = `
            <p><strong>Name:</strong> ${reservation.name}</p>
            <p><strong>Email:</strong> ${reservation.email}</p>
            <p><strong>Contact:</strong> ${reservation.contact}</p>
            <p><strong>Start Date:</strong> ${reservation.startDate}</p>
            <p><strong>End Date:</strong> ${reservation.endDate}</p>
            <p><strong>Start Time:</strong> ${reservation.startTime}</p>
            <p><strong>End Time:</strong> ${reservation.endTime}</p>
            <p><strong>Status:</strong> <span class="status ${reservation.status}">${reservation.status}</span></p>
        `;

        container.appendChild(item);
    });
}
