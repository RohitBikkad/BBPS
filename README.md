# Bal Bharati Public School (BBPS)
## Mobile-First School Staff Attendance & Leave Management Web Application

Production-ready, responsive, mobile-first web application designed for school staff attendance tracking, multi-step leave approvals, Principal daily verification, audit history, and compliant reporting.

---

## 🌟 Key Features & Architecture

### 1. Three-Tier Role-Based Access Control (RBAC)
* **Principal / Admin (`ROLE_PRINCIPAL`)**: Full authority over daily attendance approvals, bulk verification, attendance correction with mandatory audit trail, staff management, supervisor allocations, annual school calendar, and school-wide reports.
* **Supervisor (`ROLE_SUPERVISOR`)**: Manages and monitors assigned department staff attendance and reviews/recommends staff leave applications.
* **Teaching Staff (`ROLE_STAFF`)**: Mobile one-tap attendance check-in (`Present` or `Absent`), leave applications with live paid vs. unpaid day calculation, personal attendance history, and real-time approval notifications.

---

### 2. Two-Step Attendance Workflow
1. **Staff Mark Attendance**: Staff logs in from mobile phone and marks `Present` or `Absent`. Initial status is stored in PostgreSQL as `PENDING` approval.
2. **Principal Verification**: The Principal opens the **Daily Attendance Approval** desk, reviews staff check-ins, and can:
   - Approve Present / Confirm Absent with a single tap
   - One-click **"Approve All Pending"** with modal confirmation
   - Correct any attendance record with a **mandatory audit trail reason**
3. **Official Status Confirmation**: Once approved, attendance officially transitions to `PRESENT`, `ABSENT`, or `ON_LEAVE`.

---

### 3. Paid vs. Unpaid Leave System
* **8 Paid Leave Days allocated per Leave Year (2026–2027)** stored in the database.
* **Automatic Live Breakdown**: When applying for leave, the system automatically calculates:
  - Total requested calendar days
  - Deductible **Paid Days** from the remaining balance
  - **Unpaid Days** (Leave Without Pay)
  - Remaining balance preview before submission
* **Approval Safety**: Balance is **only deducted upon final Principal approval**.
* **Attendance Integration**: Approved leave dates automatically assign the staff attendance status to `ON_LEAVE` and prevent marking present on leave days.

---

### 4. Database as Single Source of Truth
* Backed by **PostgreSQL 17** (`bbps_db`).
* Refreshing the browser, logging out, or opening on another device maintains full state persistence.
* Unique database constraint on `uk_attendance_employee_date` (`employee_id` + `attendance_date`) prevents duplicate submissions.
* Immutable `attendance_audit` table tracks previous status, new status, changed by, timestamp, and explanation.

---

## 🚀 Live Demo Credentials

| Role | Name & Designation | Employee ID / Email | Password |
|---|---|---|---|
| **Pre-Primary Parent** | Mr. Vikram Sharma (Aarav's Dad • Nursery Butterflies) | `PAR001` / `parent1@bbps.edu` | `admin123` |
| **Pre-Primary Parent** | Mrs. Priya Verma (Ananya's Mom • KG Dolphins) | `PAR002` / `parent2@bbps.edu` | `admin123` |
| **Principal / Admin** | Dr. Ananya Sharma (Principal & Director) | `EMP001` / `principal@bbps.edu` | `admin123` |
| **Supervisor** | Prof. Rajesh Verma (Head of Science) | `EMP002` / `supervisor1@bbps.edu` | `admin123` |
| **Supervisor** | Mrs. Sunita Rao (Academic Coordinator) | `EMP003` / `supervisor2@bbps.edu` | `admin123` |
| **Staff Member** | Pooja Malhotra (Senior Physics Teacher) | `EMP004` / `staff1@bbps.edu` | `admin123` |
| **Staff Member** | Amitabh Sen (Chemistry Teacher) | `EMP005` / `staff2@bbps.edu` | `admin123` |
| **Staff Member** | Neha Kapoor (English Teacher & Mother Teacher) | `EMP006` / `staff3@bbps.edu` | `admin123` |
| **Staff Member** | Vikram Mehta (PGT Mathematics) | `EMP007` / `staff4@bbps.edu` | `admin123` |

> 💡 **Tip:** The login screen includes a **"Fast Demo Sign-In"** button for each role (including 1-click **Pre-Primary Parent** sign-in), allowing instant access without manual typing. Teachers also have access to the **🧸 Pre-Primary Care Desk** to publish live meal, mood, and photo updates in under 30 seconds.

---

## 📱 URLs & Port Information

* **Frontend Portal (Mobile & Desktop)**: [http://localhost:3000](http://localhost:3000)
* **Mobile LAN Access (Wi-Fi)**: [http://192.168.1.103:3000](http://192.168.1.103:3000)
* **Backend REST API**: [http://localhost:8080](http://localhost:8080)
* **Database**: PostgreSQL 17 on `127.0.0.1:5432` (`bbps_db`)

---

## 🛠️ How to Run / Restart

### Backend (Spring Boot + Java 21)
```cmd
cd E:\BBPS\backend
run-backend.bat
```

### Frontend (React + Vite + Tailwind CSS)
```cmd
cd E:\BBPS\frontend
run-npm.bat run dev
```
