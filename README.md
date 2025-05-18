# Feedback Loop Widget

A powerful and customizable feedback collection widget that helps product managers and developers gather user feedback directly from their applications.

## Features

- 🎯 Easy Integration: Simple widget installation with a single line of code
- 📊 Comprehensive Analytics: Track feedback trends, ratings, and user engagement
- 👥 User Management: Manage users and their access levels
- ⚙️ Customizable Settings: Configure widget appearance and behavior
- 📧 Email Notifications: Get notified of new feedback
- 🔒 Secure: Built with security best practices
- 📱 Responsive: Works on all devices and screen sizes

## Tech Stack

- **Frontend**: Next.js, React, Chakra UI, Recharts
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Chakra UI, Tailwind CSS
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/feedback-loop.git
   cd feedback-loop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/feedback_loop"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_WIDGET_URL="http://localhost:3000"
   ```

4. Initialize the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Widget Installation

1. Register your application in the admin dashboard
2. Copy the generated widget code
3. Add the code to your website's HTML:
   ```html
   <script src="http://localhost:3000/widget.js" data-app-id="your-app-id"></script>
   ```

## Admin Dashboard

The admin dashboard provides:

- 📊 Analytics and insights
- 👥 User management
- ⚙️ Application settings
- 📝 Feedback management
- 🔐 Access control

## API Documentation

### Feedback Endpoints

- `POST /api/feedback`: Submit new feedback
- `GET /api/admin/feedback`: List feedback with filtering
- `GET /api/admin/analytics`: Get analytics data

### User Management

- `GET /api/admin/users`: List users
- `PATCH /api/admin/users/:id`: Update user
- `DELETE /api/admin/users/:id`: Delete user

### Settings

- `GET /api/admin/settings`: Get application settings
- `PUT /api/admin/settings`: Update settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@feedbackloop.com or join our Slack channel.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/) 