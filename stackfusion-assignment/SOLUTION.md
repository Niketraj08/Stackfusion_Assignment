# Solution: Parking Management System Fixes

This document outlines the systematic fixes and architectural improvements implemented to resolve the bugs across the Django, Go, and Next.js services.

## 1. Architectural Approach
The system was designed as a multi-service architecture where **Django** handles the core business logic (bookings, data entry) and **Go** provides real-time high-performance reporting. 

**Core Synchronization Strategy:**
- **Shared Data Layer:** Switched Django from `SQLite` to the shared `PostgreSQL` container to ensure both backends see the same data.
- **Microservices Communication:** Implemented CORS (Cross-Origin Resource Sharing) across both backends to allow the Next.js frontend to aggregate data from multiple ports (:8000 and :8080).

## 2. Key Fixes Implemented

### Backend-Django (Port 8000)
- **Database Alignment:** Updated `settings.py` to use `psycopg2` with the `parking_db` PostgreSQL instance.
- **CORS Mitigation:** Installed and configured `django-cors-headers` middleware to permit frontend requests from `localhost:3000`.
- **Serializer Robustness (`serializers.py`):**
    - Marked `start_time` and `end_time` as `read_only_fields` so the API doesn't fail when the frontend creates a booking without manually providing timestamps.
    - Implemented a "Write-ID / Read-Object" pattern in `BookingSerializer` using `to_representation`. This allows the frontend to POST simple integers but receive rich nested objects (full vehicle/slot details).
- **Relational Consistency:** Ensured `slot.is_occupied` is updated synchronously during booking creation and checked out during PATCH requests.

### Backend-Go (Port 8080)
- **Headers Fix:** Injected `Access-Control-Allow-Origin: *` into the Go `respondJSON` utility. Previously, the browser would block the frontend from reading Go's reports.
- **SQL Verification:** Validated the PostgreSQL join logic for active bookings and occupancy. 

### Frontend-Nextjs (Port 3000)
- **Design System Implementation:** Created a modern, dark-themed **Glassmorphism UI** using `globals.css` with Inter typography and smooth transitions.
- **API Integration:** 
    - Added the missing `fetchOccupancy` call to the Go service.
    - Integrated real-time "Occupancy Summary Cards" on the reports page.
    - Polished the `SlotGrid` component with interactive status indicators (Free vs. Occupied).
- **State Management:** Added loading and error states to all major components to prevent the UI from feeling "frozen" during network latency.

## 3. Assumptions Made
1. **Schema Authority:** Assumed the Django app name `parking` determines the PostgreSQL table prefixes (e.g., `parking_slot`, `parking_booking`). The Go SQL queries were validated against this standard.
2. **Infrastructure:** Assumed the Docker PostgreSQL container (`parking-postgres`) is pre-launched and serves as the single source of truth.
3. **Environment:** Frontend assumes services are running on their default ports as specified in the README (`8000` for Django, `8080` for Go).

---

## 4. Bugs Identified & Resolved

Durante the audit, the following intentional "broken" behaviors were identified and fixed:

| Bug Category | Root Cause | Resolution |
| :--- | :--- | :--- |
| **Data Silos** | Django using SQLite vs. Go using Postgres. | Aligned Django to use PostgreSQL in `settings.py`. |
| **Network Block** | Missing CORS headers in both microservices. | Integrated `corsheaders` in Django and custom headers in Go. |
| **Schema Integrity** | `is_occupied` was not updating in the DB. | Added ORM update logic in `views.py` POST/PATCH handlers. |
| **API Validation** | `start_time` required in model but not by UI. | Marked time fields as `read_only` in `BookingSerializer`. |
| **API Integration** | UI only called Django, ignoring Go's reports. | Added `fetchActiveBookingsReport` and `fetchOccupancy` to Next.js. |
| **UI Reliability** | No loading/error states caused UI "freezing". | Implemented React status management and try/catch blocks. |

### How to Verify the Fixes
1. **Run Migrations:** `python manage.py migrate` in Django to populate the Postgres tables.
2. **Load Fixtures:** `python manage.py loaddata parking/fixtures/sample_data.json`.
3. **View Dashboard:** Check the slot grid at `http://localhost:3000`. Booking a slot now correctly updates its status in real-time.
4. **View Reports:** Navigate to the **Bookings & Reports** page to see the live aggregated report from both services.
