# Request & Ticket Management Web Application

A web application for managing user requests/tickets where regular users can create and track requests, and admins can manage all requests and change their statuses.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **API:** REST
- **Testing:** Jest + Supertest (backend) / Postman collection (API)
- **Deployment:** Render (backend = Web Service, frontend = Static Site), MongoDB Atlas

## Project Structure

```
/server   — Express API (models, controllers, routes, middlewares, services, tests)
/client   — React app (pages, components, services, context)
/docs     — consolidated report + Postman collection export
README.md
```

## Installation & Run Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- Git

### Backend Setup

```bash
cd server
npm install
# Create .env file with MONGO_URI, JWT_SECRET, and PORT
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
# Create .env.local file with VITE_API_URL
npm run dev
```

### Running Tests

```bash
# Backend tests
cd server
npm test

# Run Postman collection
# Import docs/postman_collection.json into Postman
```

## Environment Variables

See `.env.example` for template configuration.

## Documentation

For detailed documentation including domain analysis, requirements, architecture, database design, API specifications, and user guide, see [docs/REPORT.md](docs/REPORT.md).

## Deployment

- **Backend:** Deployed on Render as Web Service
- **Frontend:** Deployed on Render as Static Site
- **Database:** MongoDB Atlas

See [docs/REPORT.md](docs/REPORT.md) for deployment details and links.

## License

Internal project for educational purposes.
