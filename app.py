from flask import Flask, request, jsonify
from flask_cors import CORS
import db

app = Flask(__name__)
CORS(app)

users = {}
pending_reservations = []

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    contact = data.get('contact')
    role = data.get('role', 'user')

    if not name or not email or not contact:
        return jsonify({'success': False, 'message': 'All fields are required'}), 400

    if any(char.isdigit() for char in name):
        return jsonify({'success': False, 'message': 'Name cannot contain numbers'}), 400
    if not email.endswith('@gmail.com'):
        return jsonify({'success': False, 'message': 'Invalid email'}), 400
    if len(contact) != 11 or not contact.isdigit():
        return jsonify({'success': False, 'message': 'Contact must be 11 digits'}), 400
    if role == 'admin' and email != 'admin123@gmail.com':
        return jsonify({'success': False, 'message': 'Not authorized as admin'}), 403

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

@app.route('/reservations/approve/<int:index>', methods=['POST'])
def approve_reservation(index):
    if 0 <= index < len(pending_reservations):
        reservation = pending_reservations.pop(index)
        success = db.insert_reservation('approved_reservations', reservation)
        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Failed to save to database'}), 500
    return jsonify({'success': False, 'message': 'Invalid index'}), 400

@app.route('/reservations/decline/<int:index>', methods=['POST'])
def decline_reservation(index):
    if 0 <= index < len(pending_reservations):
        reservation = pending_reservations.pop(index)
        success = db.insert_reservation('declined_reservations', reservation)
        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Failed to save to database'}), 500
    return jsonify({'success': False, 'message': 'Invalid index'}), 400

@app.route('/slots/<month>/<year>', methods=['GET'])
def get_slots(month, year):
    try:
        month = int(month)
        year = int(year)
    except ValueError:
        return jsonify({'error': 'Invalid month or year'}), 400

    slot_counts = db.get_slot_counts(month, year)
    return jsonify(slot_counts)

if __name__ == '__main__':
    app.run(debug=True)
