# Fake News Project

## Overview


## Technologies Used
- **Backend:** Django
- **Frontend:** React

## Features
- User authentication and authorization
- News article submission and review
- Fake news detection algorithm
- User feedback and reporting system

## Installation

### Backend (Django)

1. Navigate to the backend directory:
    ```bash
    cd fakenews/backend
    ```
2. Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```
3. Run the Django server:
    ```bash
    python manage.py runserver
    ```

### Frontend (React)
1. Navigate to the frontend directory:
    ```bash
    cd fakenews/frontend
    ```
2. Install the required packages:
    ```bash
    npm install
    ```
3. Start the React development server:
    ```bash
    npm run dev
    ```

## To-Do
- [ ] Instead of just watched_twice, integer with count of how many times we saw a video (time > threshold) 
- [ ] For each view, have a time linked to it
- [ ] If for some reason user does not exist (but there is token active -> logout)
- [ ] Improve design of the overall website
- [ ] Test and debug
- [ ] Comment and refactor
- [ ] have a link with expiration without any login
