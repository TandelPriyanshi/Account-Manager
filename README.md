# Account Manager

A full-stack account management application built with React, Node.js, Express, and PostgreSQL, using Prisma as the ORM.

## Features

- User registration and authentication
- Secure password hashing
- JWT-based authentication
- Modern React frontend with Vite
- TypeScript for type safety
- Prisma for database management
- Environment-based configuration

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v12 or later)
- npm or yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/account-manager.git
   cd account-manager
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` in both `server` and `client` directories
   - Update the environment variables with your configuration

4. **Database Setup**
   - Make sure PostgreSQL is running
   - Update the database connection string in `server/.env`
   - Run database migrations:
     ```bash
     cd server
     npx prisma migrate dev --name init
     ```

## Available Scripts

### Root Directory
- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the server
- `npm run client` - Start only the client

### Server Directory
- `npm run dev` - Start the server in development mode
- `npm run build` - Build the server for production
- `npm start` - Start the production server
- `npx prisma studio` - Open Prisma Studio to view/edit the database

### Client Directory
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## Project Structure

```
account-manager/
├── client/                 # React frontend
├── server/                 # Node.js/Express backend
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── lib/            # Shared utilities
│   │   └── server.ts       # Server entry point
├── .gitignore
└── README.md
```

## Environment Variables

### Server (.env)
```
# Database
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=Account-Manager

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Server
PORT=5002
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.