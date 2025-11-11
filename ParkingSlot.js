window.addEventListener('load', async function() {
    updateMonthDisplay();
    updateArrowStates();
    await updateSlotCounts();

    document.getElementById('prevMonth').addEventListener('click', async function() {
        prevMonth();
        await updateSlotCounts();
    });
    document.getElementById('nextMonth').addEventListener('click', async function() {
        nextMonth();
        await updateSlotCounts();
    });

    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn !== 'user') {
        document.getElementById('proceedBtn').disabled = true;
    } else {
        document.getElementById('proceedBtn').addEventListener('click', function() {
            window.location.href = 'Reservation.html';
        });
    }
});

async function updateSlotCounts() {
    try {
        const response = await fetch(`http://localhost:5000/slots/${currentMonth + 1}/${currentYear}`);
        const slotCounts = await response.json();
        if (response.ok) {
            const dayBoxes = document.querySelectorAll('.day-box');
            dayBoxes.forEach(box => {
                const dayName = box.textContent.trim().split('\n')[0].toUpperCase();
                const countDiv = box.querySelector('.slot-count');
                if (countDiv && slotCounts[dayName] !== undefined) {
                    countDiv.textContent = slotCounts[dayName];
                }
            });
        } else {
            console.error('Error:', slotCounts.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


