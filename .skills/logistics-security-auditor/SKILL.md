---
name: logistics-security-auditor
description: Specialized Auditor for Logistics Platforms. Use when validating security posture, checking RBAC (Role-Based Access Control) integrity, auditing sensitive shipping data protection, and ensuring compliance with privacy standards (GDPR/CCPA).
---

# Logistics Security Auditor

This skill provides a rigorous framework for auditing the security of logistics platforms, focusing on the intersection of physical shipping data and digital security.

## Critical Audit Domains

### 1. Identity & Access (RBAC)
- **Validation**: Ensure `customer`, `operator` (Driver), and `admin` roles are strictly isolated.
- **Leaked Context**: Verify that `mock_user` or `dev-bypass` logic is disabled in production environments.
- **Token Security**: Audit `apiFetch` and backend middleware to ensure Firebase/Supabase tokens are verified on *every* request.

### 2. Sensitive Data Exposure (PII)
- **Shipping Data**: Names, phone numbers, and addresses must only be visible to the assigned Driver, the Customer, and Admins.
- **GPS Telemetry**: Driver location data must be treated as highly sensitive. Verify that only authorized Admins/Customers can track a specific `operator_id`.

### 3. Database Security (Prisma/PostgreSQL)
- **Input Validation**: Check for potential SQL injection vectors, though Prisma handles most.
- **Direct Access**: Ensure `DIRECT_URL` and `DATABASE_URL` are never logged or exposed in client-side bundles.

### 4. Third-Party Integrations
- **Firebase/Supabase**: Verify that Firestore Rules and Supabase RLS (Row Level Security) are active and default to "deny all".
- **Gemini AI**: Ensure user-uploaded documents (scanned bills of lading, etc.) are sanitized before being sent for AI analysis.

## Audit Workflow

1. **Scan**: Identify all endpoints in `src/backend/routes`.
2. **Verify Middleware**: Confirm `requireAuth` and `requireAdmin` are applied to sensitive routes.
3. **Inspect Frontend**: Ensure the UI doesn't expose sensitive data via `localStorage` beyond essential session tokens.
4. **Report**: Document any "Security Drift" where implementation diverges from the Production Readiness Plan.
