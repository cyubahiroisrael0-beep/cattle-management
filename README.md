# Animal Management System

A comprehensive, responsive animal management system built with React.js for managing cows and goats. Features include authentication with email verification, multi-language support, and a SQL database backend.

## Features

- 🐄 **Animal Management**: Track cows and goats with details including number, age, status, and images
- 🔐 **Authentication**: Secure user authentication with email verification
- 🌍 **Multi-language Support**: Available in English, French, Kinyarwanda, and Kiswahili
- 📱 **Responsive Design**: Works seamlessly on all devices (mobile, tablet, desktop)
- 📊 **Dashboard**: View statistics and overview of your animals
- 🖼️ **Image Upload**: Upload and manage animal images
- 📅 **Date Picker**: Easy date selection for animal age
- 🔍 **Search & Filter**: Search animals by number and filter by type and status

## Tech Stack

### Frontend
- React.js 18
- Material-UI (MUI)
- React Router
- React i18next (Internationalization)
- Axios
- React DatePicker

### Backend
- Node.js
- Express.js
- SQLite (can be easily switched to PostgreSQL/MySQL)
- JWT Authentication
- Nodemailer (Email verification)
- Multer (File uploads)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
DB_PATH=./database.sqlite
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

1. **Register**: Create a new account with your email
2. **Verify Email**: Check your email and click the verification link
3. **Login**: Sign in with your credentials
4. **Add Animals**: Click "Add Animal" to add cows or goats
5. **Manage**: Edit, delete, or view animal details
6. **Filter**: Use search and filters to find specific animals
7. **Change Language**: Select your preferred language from the top menu

## Animal Statuses

- **Active**: Currently owned and active
- **Sold**: Animal has been sold
- **Dead**: Animal has passed away
- **Other**: Any other status

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- email_verified
- verification_token
- created_at

### Animals Table
- id (Primary Key)
- number (Unique)
- type (cow/goat)
- age (Date)
- status (active/sold/dead/other)
- image (File path)
- user_id (Foreign Key)
- created_at
- updated_at

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify/:token` - Verify email

### Animals
- `GET /api/animals` - Get all animals (with filters)
- `GET /api/animals/:id` - Get single animal
- `POST /api/animals` - Create animal
- `PUT /api/animals/:id` - Update animal
- `DELETE /api/animals/:id` - Delete animal

### Users
- `GET /api/users/profile` - Get user profile

## Email Configuration

For email verification to work, you need to configure email settings in the `.env` file. For Gmail:

1. Enable 2-Step Verification
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS`

## Production Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Set up environment variables for production
3. Use a production database (PostgreSQL recommended)
4. Configure proper CORS settings
5. Set up HTTPS
6. Use environment-specific email configuration

## License

MIT License

## Support

For issues and questions, please open an issue on the repository.

