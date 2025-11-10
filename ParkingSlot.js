// Initialize month display and arrow states on page load
window.addEventListener('load', async function() {
    updateMonthDisplay();
    updateArrowStates();
    await updateSlotCounts();  // Update slot counts on load

    // Add event listeners for arrows
    document.getElementById('prevMonth').addEventListener('click', async function() {
        prevMonth();
        await updateSlotCounts();
    });
    document.getElementById('nextMonth').addEventListener('click', async function() {
        nextMonth();
        await updateSlotCounts();
    });

    // Check login status and disable buttons if not logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn !== 'user') {
        document.getElementById('proceedBtn').disabled = true;
    } else {
        document.getElementById('proceedBtn').addEventListener('click', function() {
            window.location.href = 'Reservation.html';
        });
    }
});

// Function to update slot counts from backend
async function updateSlotCounts() {
    try {
        const response = await fetch(`http://localhost:5000/slots/${currentMonth + 1}/${currentYear}`);
        const slotCounts = await response.json();
        if (response.ok) {
            // Update the slot counts in the HTML
            const dayBoxes = document.querySelectorAll('.day-box');
            dayBoxes.forEach(box => {
                const dayName = box.textContent.trim().split('\n')[0].toUpperCase();
                const countDiv = box.querySelector('.slot-count');
                if (countDiv && slotCounts[dayName] !== undefined) {
                    countDiv.textContent = slotCounts[dayName];
                }
            });
        } else {
            console.error('Error fetching slot counts:', slotCounts.error);
        }
    } catch (error) {
        console.error('Error fetching slot counts:', error);
    }
}


