Invoice Export App
This Angular application allows users to create invoices, generate PDFs, and view a list of submitted invoices. It uses json-server as a mock backend to persist invoice data and demonstrates a clear API contract between the frontend and backend.
Features

Invoice Creation: Users input personal and invoice details via a reactive form with validation, including a required signature drawn using a canvas.
PDF Generation: Generates downloadable PDFs with invoice details and signatures using jspdf.
Invoice List: Displays all invoices with a count and allows re-generation of PDFs.
Customized Snackbar: Success messages (e.g., invoice submission) use a green background, while errors (e.g., validation, network) use red for clear feedback.
API Contract: Defined in docs/api.md, specifying POST /api/invoices and GET /api/invoices endpoints, request/response formats, and error handling.
Testing: API endpoints can be tested in Postman using docs/invoice-export-api.postman_collection.json.

Prerequisites

Node.js 18.x or higher
Angular CLI 17.3.17
Postman (optional, for API testing)

Setup

Clone the repository:git clone <repository-url>
cd invoice-export-app


Install dependencies:npm install



Running the Application

Start the application and mock backend:npm run start:all


Angular runs on http://localhost:4200.
json-server runs on http://localhost:3000.


Alternatively:
Run Angular only: npm run start
Run json-server only: npm run start:api



API Contract
The API contract is documented in docs/api.md, detailing endpoints (POST /api/invoices, GET /api/invoices), request/response schemas, and error handling. Test the API using Postman with the collection in docs/invoice-export-api.postman_collection.json.
Development

Code Scaffolding: Generate components, services, etc., using:ng generate component component-name --standalone


Build: Build the project for production:ng build --configuration production

Artifacts are stored in dist/.
Unit Tests: Run tests with Karma:ng test


End-to-End Tests: Add an E2E testing package (e.g., Cypress) and run:ng e2e



Project Structure

src/app/components/invoice-form: Handles invoice creation and PDF generation.
src/app/components/invoice-list: Displays invoices with count and PDF re-generation.
src/app/services/invoice.service.ts: Manages API communication.
docs/api.md: API contract documentation.
server.js: Custom json-server middleware for endpoint routing.
db.json: Mock backend data storage.

Further Help
For Angular CLI details, use ng help or visit the Angular CLI Documentation.
