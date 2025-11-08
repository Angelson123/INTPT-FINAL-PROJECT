// Get form elements
const nameInput = document.querySelector('input[name="name"]');
const emailInput = document.querySelector('input[name="email"]');
const contactInput = document.querySelector('input[name="contact"]');
const userConfirmBtn = document.querySelector('button[value="user"]');
const adminConfirmBtn = document.querySelector('button[value="admin"]');

// Check if already logged in on page load
window.addEventListener('load', function() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'user') {
        window.location.replace('ParkingSlot.html');
    } else if (loggedIn === 'admin') {
        window.location.replace('AdminPage.html');
    }
});

// Function to validate email ends with @gmail.com
function isValidEmail(email) {
    return email.endsWith('@gmail.com');
}

// Function to validate admin email
function isAdminEmail(email) {
    return email === 'admin123@gmail.com';
}

// Function to validate name: no numbers allowed
function isValidName(name) {
    return !/\d/.test(name);
}

// Function to validate contact: exactly 11 digits
function isValidContact(contact) {
    return contact.length === 11;
}

// Contact number validation: only numbers, max 11 digits
contactInput.addEventListener('input', function(e) {
    // Remove non-numeric characters
    let value = e.target.value.replace(/\D/g, '');
    // Limit to 11 digits
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    e.target.value = value;
    // If invalid length or non-numeric, show message (but since we filter, maybe not needed)
    if (value.length > 0 && value.length < 11) {
    }
});

userConfirmBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();
    if (!name || !email || !contact) {
        alert('Please fill up all the fields.');
        return;
    }
    if (!isValidName(name)) {
        alert('Name cannot contain numbers.');
        return;
    }
    if (!isValidEmail(email)) {
        alert('Incorrect email. Please type your correct email');
        return;
    }
    if (!isValidContact(contact)) {
        alert('Contact number must be exactly 11 digits.');
        return;
    }
    localStorage.setItem('loggedIn', 'user');
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userContact', contact);
    window.location.replace('ParkingSlot.html');
});

adminConfirmBtn.addEventListener('click', function(e) {
    e.preventDefault(); 
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();
    if (!name || !email || !contact) {
        alert('Please fill up all the fields.');
        return;
    }
    if (!isValidName(name)) {
        alert('Name cannot contain numbers.');
        return;
    }
    if (!isValidContact(contact)) {
        alert('Contact number must be exactly 11 digits.');
        return;
    }
    if (!isAdminEmail(email)) {
        alert('Sorry, you are not the admin.');
        return;
    }
    localStorage.setItem('loggedIn', 'admin');
    window.location.replace('AdminPage.html');
});
