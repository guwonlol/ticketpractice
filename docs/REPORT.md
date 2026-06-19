# Request & Ticket Management Web Application — Technical Report

## 1. Introduction

TBD — Will be completed as project develops.

---

## 2. Domain Analysis

TBD — Will include:
- Application purpose
- Target audience and user roles (User, Admin)
- Relevance/justification of the project
- Existing analogues (e.g., Jira Service Desk, generic HelpDesk systems) and differences
- Expected outcome

---

## 3. Problem Statement

TBD — Will be completed in Stage 2.

---

## 4. Functional & Non-Functional Requirements

TBD — Will include:
- Functional requirements (FR):
  - Registration & login (JWT), roles user/admin
  - Create a request (title, description, category)
  - View own requests + history (user) / all requests (admin)
  - Edit a request by its author while status is "New"
  - Change request status by admin (New → In Progress → Resolved / Rejected)
  - Delete a request by author (only if not yet in progress)
  - Search & filter requests (by status, category, date)
  - Admin dashboard with status statistics
  - Status change history (audit trail) per request

- Non-functional requirements (NFR):
  - Clean, responsive UI
  - Security: password hashing (bcrypt), JWT, input validation
  - Proper error handling (centralized error middleware)
  - Performance: pagination on list views
  - Scalability & extensibility (layered backend architecture)

---

## 5. Architecture Design

TBD — Will include:
- Overall architecture: Client-Server, REST API
- Backend: layered architecture (routes → controllers → services → models)
- Frontend: component-based React architecture (pages/components/services)
- Component diagram (Mermaid)

---

## 6. Database Design

TBD — Will include:
- Entity descriptions (User, Request, Category, StatusHistory)
- Relationships
- ER diagram (Mermaid)
- Mongoose schemas with field types/validations

---

## 7. Technology Stack

TBD — Will detail each technology choice and justification.

---

## 8. Implementation

### REST API Specification

TBD — Will include endpoint table with: method, path, access level, request body, response shape.

### Code Structure

TBD — Will describe implementation details of backend and frontend.

---

## 9. Testing

### Test Cases

TBD — Will include table:
| # | Test Case | Expected Result | Actual Result | Status |

### Jest & Supertest Results

TBD — Will be populated after backend testing.

### Postman Collection Results

TBD — Will reference exported collection at `docs/postman_collection.json`.

---

## 10. Installation & Run Instructions

TBD — Will include:
- Local setup (backend + frontend)
- Environment variables
- Running the application
- Running tests
- Deployment links

---

## 11. User Guide

### For Users

TBD — Instructions for:
- Registration and login
- Creating a request
- Viewing and editing own requests
- Tracking status

### For Admins

TBD — Instructions for:
- Admin login
- Viewing all requests
- Changing request status
- Managing categories
- Viewing dashboard statistics

---

## 12. Conclusions & Limitations

TBD — Will summarize project outcomes, achievements, and any scope limitations.

---

## 13. References

TBD — Will include links to documentation, libraries, and resources used.

---

## 14. Appendix — Key Code Snippets

TBD — Will include important code examples from implementation.

---

**Document Version:** 1.0  
**Last Updated:** TBD  
**Status:** In Progress
