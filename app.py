from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# In-memory data storage using lists and dictionaries
users = {}  # Dictionary: email -> {'name': str, 'contact': str, 'role': 'user' or 'admin'}
pending_reservations = []  # List of reservation dictionaries
approved_reservations = []  # List of reservation dictionaries
declined_reservations = []  # List of reservation dictionaries

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    contact = data.get('contact')
    role = data.get('role', 'user')  # 'user' or 'admin'

    if not name or not email or not contact:
        return jsonify({'success': False, 'message': 'All fields are required'}), 400

    # Basic validation (similar to frontend)
    if any(char.isdigit() for char in name):
        return jsonify({'success': False, 'message': 'Name cannot contain numbers'}), 400
    if not email.endswith('@gmail.com'):
        return jsonify({'success': False, 'message': 'Invalid email'}), 400
    if len(contact) != 11 or not contact.isdigit():
        return jsonify({'success': False, 'message': 'Contact must be 11 digits'}), 400
    if role == 'admin' and email != 'admin123@gmail.com':
        return jsonify({'success': False, 'message': 'Not authorized as admin'}), 403

    # Store user
    users[email] = {'name': name, 'contact': contact, 'role': role}

    return jsonify({'success': True, 'role': role})

@app.route('/user/<email>', methods=['GET'])
def get_user(email):
    if email in users:
        return jsonify(users[email])
    return jsonify({'error': 'User not found'}), 404

@app.route('/reservations', methods=['POST'])
def create_reservation():
    data = request.json
    email = data.get('email')
    if email not in users:
        return jsonify({'success': False, 'message': 'User not logged in'}), 401

    reservation = {
        'name': users[email]['name'],
        'email': email,
        'contact': users[email]['contact'],
        'startTime': data.get('startTime'),
        'endTime': data.get('endTime'),
        'startDate': data.get('startDate'),
        'endDate': data.get('endDate'),
        'status': 'pending'
    }

    if not all(reservation.values()):
        return jsonify({'success': False, 'message': 'All fields required'}), 400

    pending_reservations.append(reservation)
    return jsonify({'success': True})

@app.route('/reservations/pending', methods=['GET'])
def get_pending_reservations():
    return jsonify(pending_reservations)

@app.route('/reservations/approved', methods=['GET'])
def get_approved_reservations():
    return jsonify(approved_reservations)

@app.route('/reservations/declined', methods=['GET'])
def get_declined_reservations():
    return jsonify(declined_reservations)

@app.route('/reservations/approve/<int:index>', methods=['POST'])
def approve_reservation(index):
    if 0 <= index < len(pending_reservations):
        reservation = pending_reservations.pop(index)
        approved_reservations.append(reservation)
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Invalid index'}), 400

@app.route('/reservations/decline/<int:index>', methods=['POST'])
def decline_reservation(index):
    if 0 <= index < len(pending_reservations):
        reservation = pending_reservations.pop(index)
        declined_reservations.append(reservation)
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Invalid index'}), 400

@app.route('/reservations/approved/<int:index>', methods=['DELETE'])
def delete_approved(index):
    if 0 <= index < len(approved_reservations):
        approved_reservations.pop(index)
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Invalid index'}), 400

@app.route('/reservations/declined/<int:index>', methods=['DELETE'])
def delete_declined(index):
    if 0 <= index < len(declined_reservations):
        declined_reservations.pop(index)
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Invalid index'}), 400

@app.route('/slots/<month>/<year>', methods=['GET'])
def get_slots(month, year):
    try:
        month = int(month)
        year = int(year)
    except ValueError:
        return jsonify({'error': 'Invalid month or year'}), 400

    # Calculate slot counts for each day of the week in the month
    # Count only approved reservations (occupied slots)
    slot_counts = {'MONDAY': 0, 'TUESDAY': 0, 'WEDNESDAY': 0, 'THURSDAY': 0, 'FRIDAY': 0, 'SATURDAY': 0, 'SUNDAY': 0}

    for res in approved_reservations:
        try:
            start_date = datetime.strptime(res['startDate'], '%Y-%m-%d')
            if start_date.month == month and start_date.year == year:
                day_name = start_date.strftime('%A').upper()
                if day_name in slot_counts:
                    slot_counts[day_name] += 1
        except ValueError:
            continue  # Skip invalid dates

    return jsonify(slot_counts)



if __name__ == '__main__':
    app.run(debug=True)
