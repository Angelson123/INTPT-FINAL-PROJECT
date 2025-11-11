const nameInput = document.querySelector('input[name="name"]');
const emailInput = document.querySelector('input[name="email"]');
const contactInput = document.querySelector('input[name="contact"]');
const userBtn = document.querySelector('button[value="user"]');
const adminBtn = document.querySelector('button[value="admin"]');

window.addEventListener('load', function() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'user') {
        window.location.replace('ParkingSlot.html');
    } else if (loggedIn === 'admin') {
        window.location.replace('AdminPage.html');
    }
});

function validEmail(email) {
    return email.endsWith('@gmail.com');
}

function validName(name) {
    return !/\d/.test(name);
}

function validContact(contact) {
    return contact.length === 11;
}

contactInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    e.target.value = value;
});

userBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();
    if (!name || !email || !contact) {
        alert('Please fill up all the fields.');
        return;
    }
    if (!validName(name)) {
        alert('Name cannot contain numbers.');
        return;
    }
    if (!validEmail(email)) {
        alert('Incorrect email.');
        return;
    }
    if (!validContact(contact)) {
        alert('Contact number must be exactly 11 digits.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, contact, role: 'user' })
        });
        const result = await response.json();
        if (result.success) {
            localStorage.setItem('loggedIn', 'user');
            localStorage.setItem('userEmail', email);
            window.location.replace('ParkingSlot.html');
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error connecting to server. Please try again.');
    }
});

adminBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();
    if (!name || !email || !contact) {
        alert('Please fill up all the fields.');
        return;
    }
    if (!validName(name)) {
        alert('Name cannot contain numbers.');
        return;
    }
    if (!validContact(contact)) {
        alert('Contact number must be exactly 11 digits.');
        return;
    }
    if (email !== 'admin123@gmail.com') {
        alert('Sorry, you are not the admin.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, contact, role: 'admin' })
        });
        const result = await response.json();
        if (result.success) {
            localStorage.setItem('loggedIn', 'admin');
            window.location.replace('AdminPage.html');
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error connecting to server. Please try again.');
    }
});
