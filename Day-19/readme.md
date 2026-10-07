 
 Project Overview
 
1. You are tasked with building the backend REST API for DevTicket, an internal issue and bug tracking system used by engineering teams.
 
Your API must interact with a MySQL database to manage tickets through their complete lifecycle: creation, triage, assignment, status progression, and metric aggregation.
 
2. Database Setup
must run the following SQL script in their local MySQL environment before starting:
 
CREATE DATABASE IF NOT EXISTS devticket_db;
USE devticket_db;
 
CREATE TABLE IF NOT EXISTS tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
  assigned_to VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
 
-- Seed initial test records
INSERT INTO tickets (title, description, priority, status, assigned_to) VALUES
('Login route returning 500', 'Users with special characters fail email regex', 'CRITICAL', 'OPEN', 'Aman'),
('Update brand accent color', 'Swap secondary color to navy blue in config', 'LOW', 'RESOLVED', 'Priya'),
('Checkout race condition', 'Double clicking submit triggers duplicate charges', 'HIGH', 'IN_PROGRESS', 'Rohan'),
('Memory leak in image worker', 'Worker container runs OOM after 50 jobs', 'CRITICAL', 'OPEN', NULL),
('Typo in documentation footer', 'Fix copyright year from 2025 to 2026', 'LOW', 'CLOSED', 'Sneha');
 
Feature Specifications
 
Module 1: Environment & Database Configuration
- Read all credentials (PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, API_KEY) from .env.
 Initialize and export a connection pool using mysql2/promise.
 The server must verify active database connectivity before calling app.listen(). If the database is unreachable, exit the process with status 1.
 
Module 2: Middleware Pipeline
 
You must build and integrate three custom middleware functions:

 Request Logger (src/middleware/logger.js)
 Must intercept every incoming request.
 On response finish, log: [METHOD] /path | Status: <code> | <latency>ms.

 API Key Guard (src/middleware/auth.js)
 Protect all /api/tickets routes.
 Require the request header: x-api-key.
 Compare against the API_KEY defined in .env.
 If missing or mismatched: return HTTP 401 Unauthorized.

 Payload Validator (src/middleware/validate.js)
 Intercept POST /api/tickets requests.
 Enforce:
 title: Required, string, minimum 5 characters.
 description: Required, string, minimum 10 characters.
 priority: Optional, but if provided, must be one of LOW, MEDIUM, HIGH, CRITICAL.
 If invalid: return HTTP 400 Bad Request with an array detailing each failure.


Module 3: REST API Endpoints Specification
 
 
GET/health NoSystem health check returning status and server timestamp.
GET/api/ticketsYesList tickets with search, filtering, and pagination.
GET/api/tickets/statsYesAggregate dashboard metrics across all tickets.
GET/api/tickets/:idYesFetch a single ticket by its primary key.
POST/api/ticketsYesCreate a new ticket record.
PATCH/api/tickets/:id/statusYesUpdate the status of an existing ticket.
PATCH/api/tickets/:id/assignYesAssign or reassign a ticket to a team member.
DELETE/api/tickets/:idYesPermanently remove a ticket
 
Module 4: Centralized Error Handling
Your server must implement an Express 4-parameter error handler: (err, req, res, next).
 
5. Acceptance Test Checklist
Students must verify all 10 test scenarios prior to submission:
 [ ] Test 1: GET /health returns 200 without any auth header.
 [ ] Test 2: GET /api/tickets without x-api-key header returns 401 Unauthorized.
 [ ] Test 3: GET /api/tickets with valid header returns 200 and paginated list.
 [ ] Test 4: GET /api/tickets?priority=CRITICAL filters correctly.
 [ ] Test 5: POST /api/tickets with title shorter than 5 characters returns 400 with descriptive error messages.
 [ ] Test 6: POST /api/tickets with valid data inserts into MySQL and returns 201 with ticketId.
 [ ] Test 7: PATCH /api/tickets/1/status with "INVALID_STATUS" returns 400.
 [ ] Test 8: PATCH /api/tickets/9999/status returns 404 Not Found.
 [ ] Test 9: DELETE /api/tickets/1 returns 200, and a second request to the same ID immediately returns 404.
 [ ] Test 10: Every request logs its method, URL, status code, and latency in the terminal.