// Initialize month display and arrow states on page load
window.addEventListener('load', function() {
    updateMonthDisplay();
    updateArrowStates();

    // Add event listeners for arrows
    document.getElementById('prevMonth').addEventListener('click', prevMonth);
    document.getElementById('nextMonth').addEventListener('click', nextMonth);
});
