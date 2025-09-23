# WeLoveMovies Frontend Application

This is the frontend React application for the WeLoveMovies project. It provides a modern interface for browsing movies, theaters, and reviews.

## Features

- Browse movies with filtering and search
- View detailed movie information and reviews
- See which theaters are showing specific movies
- Toast notification system for user feedback
- Responsive design using Bootstrap styles

## Quick Start

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/starter-movie-front-end.git
   cd starter-movie-front-end
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment:
   Create a `.env.development` file in the project root:

   ```bash
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

4. Start the development server:

   ```bash
   npm start
   ```

The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

## Environment Configuration

The app uses Create React App's environment system. You can configure the following variables:

- `REACT_APP_API_BASE_URL`: URL of the backend API (default: [http://localhost:5000](http://localhost:5000))

Environment files:

- `.env` - Used for production builds

Example `.env`:

```bash
REACT_APP_API_BASE_URL=https://your-api-server.com
```

## API Endpoints

The frontend expects the following API endpoints:

GET:

- `/movies` - List all movies
- `/movies/:movieId` - Get movie details
- `/movies/:movieId/theaters` - Get theaters showing a movie
- `/movies/:movieId/reviews` - Get reviews for a movie
- `/theaters` - List all theaters

## Build & Deploy

Build for production:

```bash
npm run build
```

Deploy the contents of the `build` folder to your hosting service.

## Development

Start the development server with hot reloading:

```bash
npm start
```

Run tests:

```bash
npm test
```

## Development Setup

### Port Configuration

- Frontend (default): 3000
  - To change: Set `PORT` in your `.env` file
  - Example: `PORT=3001`

- Backend API (expected): 5000
  - Configure via `REACT_APP_API_BASE_URL` in `.env` files

### API Requirements

The backend API should provide the following endpoints:

- GET `/movies` - List all movies
- GET `/movies/:movieId` - Get movie details
- GET `/movies/:movieId/theaters` - Get theaters showing a movie
- GET `/movies/:movieId/reviews` - Get reviews for a movie
- PUT `/reviews/:reviewId` - Update a review
- GET `/theaters` - List all theaters

## Project Structure

```
src/
├── home/          # Home page components
├── hooks/         # Custom React hooks
├── movie/         # Movie-related components
├── movies/        # Movie list components
├── shared/        # Shared components
├── theaters/      # Theater-related components
├── ui/            # UI components (Toast, etc.)
└── utils/         # Utilities and API client
```

## Dependencies

Core dependencies:

- React 17
- React Router 5
- React Query 3
- Axios (HTTP client)
- Bootstrap (styles)

## Troubleshooting

Common issues and solutions:

1. API Connection Issues
   - Verify API is running (`curl http://localhost:5000/movies`)
   - Check CORS settings in backend
   - Verify environment variables

2. Build Errors
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear build cache: `npm run build -- --reset-cache`
