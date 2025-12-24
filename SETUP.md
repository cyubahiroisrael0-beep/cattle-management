# Setup Guide

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Windows PowerShell:
Copy-Item .env.example .env

# Linux/Mac:
cp .env.example .env

# Edit .env file with your email configuration
# Then start the server
npm start
# or for development
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## Email Configuration

To enable email verification, you need to configure email settings in `backend/.env`:

### Gmail Setup:
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Use this app password in `EMAIL_PASS` in your `.env` file

Example `.env` configuration:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DB_PATH=./database.sqlite
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
FRONTEND_URL=http://localhost:3000
```

### Other Email Providers:
- **Outlook**: Use `smtp-mail.outlook.com` on port 587
- **Yahoo**: Use `smtp.mail.yahoo.com` on port 587
- **Custom SMTP**: Update `EMAIL_HOST` and `EMAIL_PORT` accordingly

## Database

The system now supports MySQL. Set these in `backend/.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=cattle_management
```
The app will create tables automatically on start.

### Switching to PostgreSQL or MySQL

To use PostgreSQL or MySQL instead of SQLite:

1. Install the appropriate driver:
   ```bash
   # For PostgreSQL
   npm install pg
   
   # For MySQL
   npm install mysql2
   ```

2. Update `backend/config/database.js` to use the new database connection

3. Update your `.env` file with database connection details

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, change `PORT` in `backend/.env`

### Email Not Sending
- Check your email credentials in `.env`
- Verify app password is correct (for Gmail)
- Check firewall/network settings
- Check email provider's SMTP settings

### CORS Errors
Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL

### Database Errors
- Ensure write permissions in the backend directory
- Check that SQLite is properly installed
- Delete `database.sqlite` and restart to recreate tables

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Use a strong `JWT_SECRET`
3. Use a production database (PostgreSQL recommended)
4. Configure proper CORS settings
5. Set up HTTPS
6. Build frontend: `cd frontend && npm run build`
7. Serve frontend build with a web server (nginx, Apache, etc.)

