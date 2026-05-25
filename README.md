# teams-tracking-system

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Create a `.env` file from `.env.example`
- Update `MEDIA_API_KEY` in `.env` with your API key

### Running the Project

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update environment variables:**
   - Edit `.env` and set `MEDIA_API_KEY=your_actual_api_key`
   - Other variables have sensible defaults for local development

3. **Start all services:**
   ```bash
   docker compose up --build
   ```

4. **Access the services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - MySQL: localhost:3306

5. **View logs:**
   ```bash
   docker compose logs -f
   ```

6. **Stop services:**
   ```bash
   docker compose down
   ```

7. **Remove data volume (clean slate):**
   ```bash
   docker compose down -v
   ```

### Docker Setup Details

- **MySQL**: Runs on port 3306 with data persisted in a Docker volume
- **Backend**: Spring Boot application running on port 8080
  - Waits for MySQL healthcheck before starting
  - Runs Flyway migrations automatically
  - Reads configuration from environment variables
- **Frontend**: Next.js application running on port 3000
  - Uses `NEXT_PUBLIC_API_URL` to connect to the backend

### Local Development (without Docker)

If you prefer to run without Docker:

1. **Backend:**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Ensure MySQL is running locally on port 3306.