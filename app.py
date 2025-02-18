from flask import Flask, render_template, request, redirect, url_for, flash, session
import mysql.connector
import hashlib
import bcrypt
import os
from datetime import datetime,timedelta
from dotenv import load_dotenv
from flask_restful import Api, Resource
app = Flask(__name__)

api = Api(app)


app.permanent_session_lifetime = timedelta(minutes=30)

load_dotenv()
app.secret_key = os.getenv("SECRET_KEY")

class UserProfileAPI(Resource):
    def get(self):
        if 'username' not in session:
            return {"error": "Unauthorized"}, 401

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT username, email FROM users WHERE username = %s", (session['username'],))
        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user:
            return {"username": user[0], "email": user[1]}, 200
        return {"error": "User not found"}, 404

api.add_resource(UserProfileAPI, '/api/profile')

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        auth_plugin="mysql_native_password"
    )

# Home Route
@app.route('/')
def home():
    return redirect(url_for('login'))

# Sign-Up Route
@app.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT username FROM users WHERE username = %s", (username,))
        if cursor.fetchone():
            flash("Username already exists! Choose a different one.", "error")
            return render_template('sign_up.html')

        cursor.execute("INSERT INTO users (username, password, email) VALUES (%s, %s, %s)", 
                       (username, hashed_password, email))
        connection.commit()
        cursor.close()
        connection.close()

        flash("Sign up successful! Please log in.", "success")
        return redirect(url_for('login'))

    return render_template('sign_up.html')

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
        session.permanent=True  # Extend session if user logs in again
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT username, password FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user and bcrypt.checkpw(password.encode(), user[1].encode()):
            session['username'] = username
            flash("Login successful!", "success")
            return redirect(url_for('dashboard'))
        else:
            flash("Invalid credentials!", "error")

    return render_template('login.html')

# Logout Route
@app.route('/logout')
def logout():
    session.pop('username', None)
    flash("You have been logged out.", "success")
    return redirect(url_for('login'))

# Dashboard Route
@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM workouts WHERE username = %s", (session['username'],))
    workouts = cursor.fetchall()
    cursor.close()
    connection.close()

    return render_template('dashboard.html', workouts=workouts)

# Profile Route
@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'username' not in session:
        return redirect(url_for('login'))  # Redirect to login if not logged in
    
    username = session['username']
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Fetch user details from the database
    cursor.execute("SELECT username, email, created_at FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()  # Fetch a single row as a tuple
    
    if user:
        user = {
            'username': user[0],
            'email': user[1],
            'created_at': user[2].strftime('%Y-%m-%d %H:%M:%S') if user[2] else None
        }

    return render_template('profile.html', user=user)

# Edit Profile Route
@app.route('/edit_profile', methods=['GET', 'POST'])
def edit_profile():
    if 'username' not in session:
        return redirect(url_for('login'))  # Redirect to login if not logged in

    username = session['username']
    
    # Open database connection
    connection = get_db_connection()
    cursor = connection.cursor()

    # Fetch user details
    cursor.execute("SELECT username, email FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    if not user:
        flash("User not found!", "error")
        return redirect(url_for('dashboard'))  # Redirect if user doesn't exist

    if request.method == 'POST':
        new_email = request.form['email']
        new_password = request.form['password']

        # Hash new password with bcrypt
        new_password_hashed = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()

        # Update user info
        cursor.execute(
            "UPDATE users SET email = %s, password = %s WHERE username = %s",
            (new_email, new_password_hashed, username)
        )
        connection.commit()

        flash('Profile updated successfully!', 'success')
        return redirect(url_for('profile'))

    # Close connection properly
    cursor.close()
    connection.close()

    return render_template('edit_profile.html', user=user)

# Add Workout Route
@app.route('/add_workout', methods=['GET', 'POST'])
def add_workout():
    if 'username' not in session:
        flash("You must be logged in to add a workout.", "error")
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        username = session['username']
        workout_name = request.form['workout_name']
        description = request.form['description']
        duration = request.form['duration']
        intensity = request.form['intensity']
        category = request.form['category']
        date = request.form['date']  # Getting date from the form

        # Ensure the date is in the correct format (if needed)
        try:
            date = datetime.strptime(date, "%Y-%m-%d").date()  # Convert the string date to a Python date object
        except ValueError:
            flash("Invalid date format.", "error")
            return redirect(url_for('add_workout'))

        # Database connection
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # Insert workout data into the database, including the date
        query = """
            INSERT INTO workouts (username, workout_name, description, duration, intensity, date,category)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (username, workout_name, description, duration, intensity, date,category)
        cursor.execute(query, values)
        connection.commit()
        
        flash("Workout added successfully!", "success")
        return redirect(url_for('dashboard'))  # Redirect to dashboard or another page
    
    from datetime import date
    today = date.today()
    return render_template('add_workout.html', today=today)

@app.route('/about')
def about():
    return render_template('about.html')


if __name__ == '__main__':
    app.run(debug=True)
