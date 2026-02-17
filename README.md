# Weather Analytics App

A full-stack weather application with custom comfort scoring, user authentication, and caching.

## Tech Stack

- **Frontend**: React 19 + Vite, Tailwind CSS 4, Auth0, Axios
- **Backend**: Node.js + Express, Sequelize ORM, Auth0 JWT validation
- **Database**: MySQL (Railway cloud hosting)
- **APIs**: OpenWeatherMap API

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MySQL database (or Railway account)
- Auth0 account (free tier)
- OpenWeatherMap API key (free tier)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file with the following variables:
```env
PORT=3000
DATABASE_URL=mysql://username:password@host:port/database
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier
OPENWEATHER_API_KEY=your_openweather_api_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
```

3. Start the dev server:
```bash
npm run dev
```

### Auth0 Configuration

1. Create an Auth0 application (Single Page Application type)
2. Create an Auth0 API with identifier matching `AUTH0_AUDIENCE`
3. Configure Allowed Callback URLs: `http://localhost:5173`
4. Configure Allowed Logout URLs: `http://localhost:5173`
5. Enable MFA in Auth0 Dashboard → Security → Multi-factor Auth
6. In Applications → Your App → APIs tab, set "User Access" to "Authorized"

### Environment Variables - Security Notes

**Safe to share publicly** (exposed in frontend):
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_AUDIENCE`

**Never share** (keep private):
- `DATABASE_URL` - Full database access
- `OPENWEATHER_API_KEY` - Tied to your OpenWeatherMap quota
- Any production secrets or JWT keys

## Comfort Index Formula

The app calculates a comfort score (0-100) based on weather conditions using a weighted deviation approach.

### Formula
```
Comfort Score = (1 - Weighted Deviation) × 100
```

Where:
```
Weighted Deviation = (6T + 3H + 1W) / 10

T = |temperature - 24°C| / 24
H = |humidity - 50%| / 50
W = |windSpeed - 2 m/s| / 10

24, 50 and 10 are the maximum acceptable deviations for each factor, chosen based on comfort standards and typical weather ranges.
```

### Ideal Conditions
- **Temperature**: 24°C (75°F) - Widely considered optimal room temperature
- **Humidity**: 50% - Comfortable middle ground
- **Wind Speed**: 2 m/s (4.5 mph) - Light breeze

### Variable Weights

**Temperature: 60% weight**
- Most significant impact on human comfort
- Humans are highly sensitive to temperature extremes

**Humidity: 30% weight**
- Secondary but important factor
- Affects perceived temperature 
- High humidity impairs body's cooling mechanism

**Wind Speed: 10% weight**
- Least critical within typical urban ranges
- Only becomes uncomfortable at extremes
- Indoor/outdoor context varies significantly

### Trade-offs Considered

**Why not use "feels like" temperature directly?**
- Loses granularity of individual factors
- Can't explain *why* a location is uncomfortable
- Our multi-factor approach provides transparency

**Why simple weighted formula vs ML model?**
- Explainable: Users can understand the scoring
- Predictable: Deterministic results
- No training data required
- Fast computation (sub-millisecond)

**Why these specific ideal values?**
- 24°C is WHO recommended indoor temperature
- 50% humidity is ASHRAE comfort standard
- 2 m/s balances stillness vs wind chill

**Limitations of this approach:**
- Doesn't account for rain/snow (visual preference)
- Ignores personal preferences (some prefer cold)
- No seasonal adaptation (winter coat factor)
- Static ideals regardless of location culture

## Cache Design

### Implementation
- **Strategy**: In-memory caching using `node-cache`
- **TTL**: 5 minutes (300 seconds)
- **Key**: Single bulk key `"weather:all:cities"`

### Why Bulk Caching?
- Fetches all 10 cities in one parallel batch using `Promise.all`
- Stores complete dataset as single cache entry
- **Trade-off**: All-or-nothing invalidation
- **Benefit**: Consistent data (all cities same timestamp)
- **Benefit**: Simplified cache logic (no per-city tracking)

## Known Limitations

1. **Fixed City List**: Only 10 pre-configured cities (hardcoded in `cities.json`)
2. **No Rain/Snow Impact**: Comfort score ignores precipitation preference
3. **API Dependency**: App unusable if OpenWeatherMap API is down
4. **No Historical Data**: Only current weather, no trend analysis
5. **Static Ideals**: Doesn't adapt to regional climate norms (24°C uncomfortable in tropical regions)
6. **Auth0 Dependency**: Authentication tied to third-party service
7. **No Offline Mode**: Requires internet connection for all features

## Features

-  Real-time weather data for 10 global cities
-  Custom comfort scoring algorithm
-  Auth0 authentication with MFA support
-  User preferences (favorite cities)
-  Star badges and filtering for favorites
-  Server-side caching (5-minute TTL)
-  Responsive UI (mobile + desktop)
-  Cloud MySQL database (Railway)

## Project Structure

```
weather-app/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   └── services/       # Business logic (weather, cache, comfort)
├── frontend/
│   ├── src/
│   │   ├── auth/       # Auth0 configuration
│   │   ├── components/ # React components
│   │   ├── pages/      # Route pages
│   │   └── services/   # API client
│   └── public/
└── cities.json         # City configuration
```

## API Endpoints

- `GET /api/weather/cities` - Get all cities with comfort scores (public)
- `GET /api/user/preferences/:key` - Get user preference (protected)
- `POST /api/user/preferences` - Save user preference (protected)

## License

This project is for educational purposes (Fidenz assignment).
