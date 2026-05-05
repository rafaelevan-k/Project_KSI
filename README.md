# Project Keamanan Sistem Informasi (KSI)

This project is a web application developed for educational purposes in the Information System Security course. It features a Vulnerability Testing Lab where users can learn about and simulate common web attacks such as SQL Injection and Cross-Site Scripting (XSS) in a controlled environment.

## Project Structure

The project is divided into two main components:
- backend_laravel: The API built with Laravel 12.
- frontend_reactjs: The user interface built with React 19 and Vite.

## Technology Stack

### Backend
- Framework: Laravel 12
- Language: PHP 8.x
- Authentication: Laravel Sanctum
- Database: MySQL
- Architecture: RESTful API

### Frontend
- Framework: React 19
- Build Tool: Vite
- Styling: Tailwind CSS 4
- State Management: Zustand
- Animations: Framer Motion
- Icons: Lucide React
- Notifications: React Hot Toast
- Routing: React Router DOM 7

## Key Features

### 1. Authentication System
- User registration and login.
- Secure session management using Laravel Sanctum tokens.
- Email verification and password reset functionality.
- Professional logout with confirmation prompts.

### 2. Security Level Management
- Users can toggle between "Low" and "Normal" security levels.
- The security level is persisted in the database for each user.
- This setting directly affects how the backend processes inputs and how the frontend renders data.

### 3. Vulnerability Testing Lab
- SQL Injection: A simulation showing the difference between vulnerable raw queries (Low) and secure prepared statements (Normal).
- Cross-Site Scripting (XSS): A simulation demonstrating how unsanitized input can execute scripts in the browser (Low) versus safe escaping (Normal).

## API Endpoints Documentation

The backend provides several endpoints for authentication and security testing. Most endpoints require a Bearer Token provided after a successful login.

### Public Endpoints
- POST /api/register: Register a new user account.
- POST /api/login: Authenticate user and receive a Sanctum token.
- POST /api/forgot-password: Request a password reset link.
- POST /api/reset-password: Update password using a reset token.
- GET /api/email/verify/{id}/{hash}: Verify user email address.
- GET /api/test: Connectivity check endpoint.

### Protected Endpoints (Requires Sanctum Token)
- GET /api/user: Retrieve current authenticated user profile.
- POST /api/logout: Revoke current user session token.
- GET /api/dashboard: Retrieve dashboard statistics and status.

### Security and Vulnerability Lab Endpoints
- GET /api/security-level: Get the current security level of the user.
- POST /api/security-level: Update the security level (Body: { "security_level": "low" | "normal" }).
- GET /api/vulnerable/sql-injection?id={payload}: Simulate SQL Injection. Behavioral difference based on security level.
- GET /api/vulnerable/xss?name={payload}: Simulate Cross-Site Scripting. Behavioral difference based on security level.

## Installation and Setup

### Backend Prerequisites
- PHP >= 8.2
- Composer
- MySQL Server

### Backend Setup
1. Navigate to the backend directory:
   cd backend_laravel
2. Install dependencies:
   composer install
3. Configure the environment:
   Copy .env.example to .env and configure your database settings.
4. Generate application key:
   php artisan key:generate
5. Run migrations:
   php artisan migrate
6. Start the server:
   php artisan serve

### Frontend Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Frontend Setup
1. Navigate to the frontend directory:
   cd frontend_reactjs
2. Install dependencies:
   npm install
3. Start the development server:
   npm run dev

## Security Lab Implementation Details

### SQL Injection Lab
In the Low security setting, the backend uses raw query concatenation, allowing for classic SQL injection payloads like '1 OR 1=1'. In the Normal setting, it utilizes Eloquent ORM or prepared statements which automatically prevent injection.

### XSS Lab
In the Low security setting, the frontend uses the dangerouslySetInnerHTML property to render API responses directly, allowing script execution. In the Normal setting, React's default escaping mechanism is used to render input as plain text.

## UI Design System
The application uses a custom brand palette:
- Primary Color: #C9B59C
- Background Color: #F9F8F6
- Accent Colors: #D9CFC7, #EFE9E3

The design focuses on premium aesthetics, featuring smooth transitions, backdrop blurs, and a clean typography system using Inter and Roboto fonts.
