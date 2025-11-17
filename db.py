import mysql.connector
import datetime

def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='db_parking'
        )
        return connection
    except:
        return None

def create_tables():
    connection = create_connection()
    if connection is None:
        return
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS approved_reservations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255),
            contact VARCHAR(11),
            start_time VARCHAR(10),
            end_time VARCHAR(10),
            start_date DATE,
            end_date DATE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS declined_reservations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255),
            contact VARCHAR(11),
            start_time VARCHAR(10),
            end_time VARCHAR(10),
            start_date DATE,
            end_date DATE
        )
    """)
    connection.commit()
    cursor.close()
    connection.close()

def insert_reservation(table_name, reservation):
    connection = create_connection()
    if connection is None:
        return False
    cursor = connection.cursor()
    cursor.execute(f"""
        INSERT INTO {table_name} (name, email, contact, start_time, end_time, start_date, end_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        reservation['name'],
        reservation['email'],
        reservation['contact'],
        reservation['startTime'],
        reservation['endTime'],
        reservation['startDate'],
        reservation['endDate']
    ))
    connection.commit()
    cursor.close()
    connection.close()
    return True

def get_reservations(table_name):
    connection = create_connection()
    if connection is None:
        return []
    cursor = connection.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM {table_name}")
    results = cursor.fetchall()
    for res in results:
        if 'start_date' in res and isinstance(res['start_date'], datetime.date):
            res['start_date'] = res['start_date'].isoformat()
        if 'end_date' in res and isinstance(res['end_date'], datetime.date):
            res['end_date'] = res['end_date'].isoformat()
    cursor.close()
    connection.close()
    return results

def delete_reservation(table_name, index):
    connection = create_connection()
    if connection is None:
        return False
    cursor = connection.cursor()
    cursor.execute(f"SELECT id FROM {table_name} LIMIT {index},1")
    result = cursor.fetchone()
    if result:
        cursor.execute(f"DELETE FROM {table_name} WHERE id = %s", (result[0],))
        connection.commit()
    cursor.close()
    connection.close()
    return result is not None

def get_slot_counts(month, year):
    connection = create_connection()
    if connection is None:
        return {'MONDAY': 0, 'TUESDAY': 0, 'WEDNESDAY': 0, 'THURSDAY': 0, 'FRIDAY': 0, 'SATURDAY': 0, 'SUNDAY': 0}
    cursor = connection.cursor()
    cursor.execute("""
        SELECT DAYNAME(start_date), COUNT(*)
        FROM approved_reservations
        WHERE MONTH(start_date) = %s AND YEAR(start_date) = %s
        GROUP BY DAYNAME(start_date)
    """, (month, year))
    results = cursor.fetchall()
    slot_counts = {'MONDAY': 0, 'TUESDAY': 0, 'WEDNESDAY': 0, 'THURSDAY': 0, 'FRIDAY': 0, 'SATURDAY': 0, 'SUNDAY': 0}
    for day, count in results:
        day = day.upper()
        if day in slot_counts:
            slot_counts[day] = count
    cursor.close()
    connection.close()
    return slot_counts

def get_user_reservations(email, table_name):
    connection = create_connection()
    if connection is None:
        return []
    cursor = connection.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM {table_name} WHERE email = %s", (email,))
    results = cursor.fetchall()
    for res in results:
        if 'start_date' in res and isinstance(res['start_date'], datetime.date):
            res['startDate'] = res['start_date'].isoformat()
        if 'end_date' in res and isinstance(res['end_date'], datetime.date):
            res['endDate'] = res['end_date'].isoformat()
        if 'start_time' in res:
            res['startTime'] = res['start_time']
        if 'end_time' in res:
            res['endTime'] = res['end_time']
    cursor.close()
    connection.close()
    return results

create_tables()
