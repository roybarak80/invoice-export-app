# Invoice Export App

A Dockerized application featuring an Angular frontend served by Nginx and a `json-server` backend providing mock invoice data at `http://localhost:3000/api/invoices`. Docker Compose is used to manage both services.

A demo video showcasing the application's usage is available in the repository.

## Docker Images
- **Frontend**: `roybarak1/invoice-angular-app:latest` ([Docker Hub](https://hub.docker.com/r/roybarak1/invoice-angular-app))
- **Backend**: Uses the standard `node:18` image with `json-server`

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or later) installed

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/roybarak80/invoice-export-app.git
cd invoice-export-app
```

### 2. Run with Docker Compose
```bash
docker-compose up -d
```

### 3. Expected Output
```
✔ Network invoice-export-app_app-network   Created
✔ Container invoice-export-app-backend-1   Started
✔ Container invoice-export-app-frontend-1  Started
```

### 4. Access the Application
- **Frontend**: Open [http://localhost:8080](http://localhost:8080) in a browser (use incognito mode to avoid caching issues).
- **Backend API**: Test with `curl http://localhost:3000/api/invoices` or visit in a browser.

## Files Included
- `docker-compose.yml`: Defines frontend and backend services
- `Dockerfile`: Builds the Angular frontend
- `nginx.conf`: Configures Nginx for Angular routing
- `db.json`: Mock data for `json-server`
- `server.js`: Configures `json-server` to serve `/api/invoices`
- `package.json`: Lists dependencies, including `json-server`

## Additional Information
- **Source Code**: [https://github.com/roybarak80/invoice-export-app](https://github.com/roybarak80/invoice-export-app)
- **Note**: If the app doesn’t load in a regular browser, clear the cache or use incognito mode.
- **Troubleshooting**: If the `invoice-export-app-backend-1` container is not running, restart it with:
  ```bash
  docker-compose restart invoice-export-app-backend-1
  ```

## Contact
For questions or feedback, please contact Roy Barak via [GitHub](https://github.com/roybarak80).

Thank you for exploring the Invoice Export App!