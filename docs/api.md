API Contract
Overview
This document defines the API contract for the invoice-export-app, specifying endpoints, request/response formats, and error handling between the Angular frontend and json-server mock backend. All endpoints are prefixed with /api.
Endpoints
POST /api/invoices
Description: Creates a new invoice with form data and optional PDF.
Request:

Method: POST
URL: http://localhost:3000/api/invoices
Headers: Content-Type: application/json
Body:{
  "fullName": "string",
  "email": "string",
  "phone": "string | null",
  "invoiceNumber": "string",
  "amount": "number",
  "invoiceDate": "string (ISO 8601)",
  "signature": "string (base64 PNG)",
  "pdf": "string (base64 PDF) | null",
  "createdAt": "string (ISO 8601)"
}


phone and pdf are optional.
invoiceNumber: Alphanumeric only.
amount: Positive number.



Response:

Status: 201 Created
Body:{
  "id": "number",
  "fullName": "string",
  "email": "string",
  "phone": "string | null",
  "invoiceNumber": "string",
  "amount": "number",
  "invoiceDate": "string",
  "signature": "string",
  "pdf": "string | null",
  "createdAt": "string"
}



Errors:

400 Bad Request:{ "error": "Invalid request data" }


0 Network Error: Client-side message: "Network error. Please check your connection."

GET /api/invoices
Description: Retrieves all invoices.
Request:

Method: GET
URL: http://localhost:3000/api/invoices
Headers: None

Response:

Status: 200 OK
Body:[
  {
    "id": "number",
    "fullName": "string",
    "email": "string",
    "phone": "string | null",
    "invoiceNumber": "string",
    "amount": "number",
    "invoiceDate": "string",
    "signature": "string",
    "pdf": "string | null",
    "createdAt": "string"
  }
]



Errors:

0 Network Error: Client-side message: "Network error. Please check your connection."

Implementation Notes

Backend: Mocked with json-server, using server.js to map /api/invoices to /invoices in db.json.
PDF Handling: Stored as base64 in db.json for the mock. In production, PDFs would be sent as multipart files via FormData.
Validation: Client-side validation ensures invoiceNumber is alphanumeric and amount is positive. Production backends should enforce server-side validation.

