# Invoice Export App

An Angular application for creating and exporting invoices with signature support.

## Features

- Create invoices with customer details
- Digital signature support
- PDF export functionality
- JSON Server backend for data persistence

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start:all
   ```

This will start both the Angular frontend (port 4200) and the JSON Server API (port 3000).

## Deployment to Render.com

### Option 1: Using render.yaml (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Render.com
3. Render will automatically detect the `render.yaml` file and deploy both services

### Option 2: Manual Deployment

#### Deploy Frontend (Static Site)

1. Create a new **Static Site** service in Render
2. Connect your Git repository
3. Configure the build settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist/invoice-export-app`

#### Deploy Backend (Web Service)

1. Create a new **Web Service** in Render
2. Connect your Git repository
3. Configure the settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start:api`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`

### Update API URL

After deploying the backend, update the API URL in `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://your-api-service-name.onrender.com/api'
};
```

Replace `your-api-service-name` with your actual Render service name.

## Project Structure

- `src/` - Angular application source code
- `server.js` - JSON Server backend
- `db.json` - Database file
- `render.yaml` - Render deployment configuration

## Technologies Used

- Angular 17
- Angular Material
- JSON Server
- jsPDF
- html2canvas
- ngx-signaturepad

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
- **Note**: If the app doesn't load in a regular browser, clear the cache or use incognito mode.
- **Troubleshooting**: If the `invoice-export-app-backend-1` container is not running, restart it with:
  ```bash
  docker-compose restart invoice-export-app-backend-1
  ```

## Contact
For questions or feedback, please contact Roy Barak via [GitHub](https://github.com/roybarak80).

Thank you for exploring the Invoice Export App!