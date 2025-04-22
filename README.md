# Leave Management System

A modern, feature-rich leave management system built with React, TypeScript, and Vite.

## Features

- Employee Leave Management
  - Annual Leave
  - Sick Leave
  - Personal Leave
  - Maternity Leave
  - Paternity Leave
  - Compassionate Leave (Weekends and Holidays only)
  - Unpaid Leave
- Admin Dashboard
  - Leave Request Approval/Rejection
  - Employee Management
  - Leave Policy Configuration
  - Holiday Management
- User Features
  - Leave Application
  - Leave History
  - Document Upload
  - Status Tracking
  - Email Notifications

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/leave-management-frontend.git
cd leave-management-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=http://localhost:5500
VITE_APP_NAME=IST Africa
VITE_APP_DESCRIPTION=Modern Leave Management System
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5500 |
| VITE_APP_NAME | Application Name | IST Africa |
| VITE_APP_DESCRIPTION | Application Description | Modern Leave Management System |

### Leave Types Configuration

The system supports the following leave types:

1. Annual Leave
   - Requires reason
   - Can be half-day or full-day
   - Requires manager approval

2. Sick Leave
   - Requires reason
   - Requires medical certificate for >2 days
   - Can be half-day or full-day
   - Requires manager approval

3. Personal Leave
   - Requires reason
   - Can be half-day or full-day
   - Requires manager approval

4. Maternity Leave
   - Requires reason
   - Full-day only
   - Requires manager approval

5. Paternity Leave
   - Requires reason
   - Full-day only
   - Requires manager approval

6. Compassionate Leave
   - Only available on weekends and holidays
   - Requires reason
   - Full-day only
   - Requires manager approval

7. Unpaid Leave
   - Requires reason
   - Can be half-day or full-day
   - Requires manager approval

### Leave Policy Configuration

The system allows configuration of:

1. Minimum days before request
2. Maximum leave days per type
3. Required documentation
4. Approval workflow
5. Holiday calendar

## Development

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Build for production:
```bash
npm run build
# or
yarn build
```

3. Preview production build:
```bash
npm run preview
# or
yarn preview
```

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t leave-management-frontend .
```

2. Run the container:
```bash
docker run -p 80:80 leave-management-frontend
```

## API Integration

The frontend communicates with the backend API using the following endpoints:

### Leave Management
- `GET /api/leave/policy` - Get leave policy
- `GET /api/leave/holidays` - Get holidays
- `POST /api/leave/apply` - Apply for leave
- `GET /api/leave/history` - Get leave history
- `PUT /api/leave/cancel/:id` - Cancel leave request

### Compassionate Leave
- `GET /api/compassionate` - Get compassionate leave requests
- `POST /api/compassionate` - Apply for compassionate leave
- `PUT /api/compassionate/:id` - Update compassionate leave status
- `DELETE /api/compassionate/:id` - Cancel compassionate leave

### Admin
- `GET /api/admin/leave-requests` - Get all leave requests
- `PUT /api/admin/leave-requests/:id` - Update leave request status
- `GET /api/admin/employees` - Get all employees
- `POST /api/admin/employees` - Add new employee
- `PUT /api/admin/employees/:id` - Update employee
- `DELETE /api/admin/employees/:id` - Delete employee

## Project Structure

```
src/
├── components/
│   ├── admin/           # Admin components
│   ├── leave/           # Leave management components
│   ├── layout/          # Layout components
│   └── ui/              # UI components
├── features/
│   └── api/             # API integration
├── hooks/               # Custom hooks
├── lib/                 # Utility functions
├── pages/               # Page components
├── types/               # TypeScript types
└── App.tsx             # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@IST Africa.com or create an issue in the repository.
