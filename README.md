# Anup Fabrication — Complete Full-Stack Web Platform

Production-ready web application for **Anup Fabrication** (31/1 Nangli Sakrawati, Najafgarh, New Delhi 110043).

- **Deployment URL**: https://anupfabrication.infinityfree.me
- **Phone Numbers**: +91 7217853257 / +91 7838640423
- **Primary Coverage**: Delhi, Dwarka, Najafgarh, Gurgaon, Noida & Greater Delhi NCR
- **Supported Languages**: English (`en`) and हिन्दी (`hi`) with persistent switcher
- **Stack**: React 19 + TypeScript + Vite + Tailwind CSS 4 + Express + Supabase (PostgreSQL / Auth / Storage / Edge Functions) + Razorpay Payments + Gemini AI (3.8 Flash).

---

## 1. Quick Start in Google AI Studio

This application is ready to run immediately:

```bash
# 1. Install dependencies
npm install

# 2. Start the full-stack development server
npm run dev
```

The application runs on `http://localhost:3000` with the Express proxy mounted alongside Vite SPA middlewares.

---

## 2. Testing Features & User Roles

For fast review and demonstration, you can switch roles directly from the header user badge:
- **Customer Mode (Rajesh Sharma)**:
  - Submit multi-step quotation requests (dimensions, specs, CAD files).
  - Review itemized quotes in the Customer Dashboard.
  - Test Razorpay advance payment flow.
  - Track site inspection bookings and download payment receipts.
- **Admin Mode (Workshop Master)**:
  - Review live lead enquiries in the Enquiry Triage desk.
  - Generate official itemized quotations with automated subtotal, GST (18%), discount, and advance percentage.
  - Update inspection and installation dates.
  - Manage services and prices in the CMS.
  - Export CSV reports for Enquiries, Bookings, and Verified Revenue.
  - Inspect audit logs.
- **Bilingual Switcher**:
  - Click the **हिन्दी / English** button in the header to switch languages instantly across all navigation, forms, quotations, and dashboard cards.
- **AI Fabrication Assistant**:
  - Click the floating **Fabrication AI Assistant** button at bottom right to ask questions about gate designs, steel grades, sheds, and quotation requirements in English or Hindi.

---

## 3. Supabase Setup Guide

### A. Run SQL Migration
1. Log in to your [Supabase Dashboard](https://supabase.com).
2. Create a new project named `anup-fabrication`.
3. Open the **SQL Editor** in your Supabase dashboard.
4. Copy the entire contents of `supabase/migrations/20261024000000_init_anup_fabrication.sql` and run it.
5. This creates:
   - `profiles`, `user_roles`, `services`, `projects`, `enquiries`, `enquiry_files`, `quotations`, `quotation_items`, `bookings`, `payments`, `audit_logs`, and `business_settings`.
   - Complete Row Level Security (RLS) policies.
   - Seed data for Anup Fabrication services and official business contact information.

### B. Storage Buckets Setup
In Supabase **Storage**, create these 3 buckets:
- `project-gallery`: Public access (for photos of completed gates, sheds, and railings).
- `service-images`: Public access.
- `enquiry-files`: **Private** access (client CAD blueprints, site images, drawings).

### C. Creating the First Administrator
In Supabase Auth, register your email (e.g. `admin@anupfabrication.infinityfree.me`), then run:
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@anupfabrication.infinityfree.me';
```

---

## 4. Razorpay Integration Setup

1. Sign up or log in to the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Go to **Settings > API Keys** and generate **Key ID** and **Key Secret** in **Test Mode**.
3. Set your public Key ID in `.env`:
   ```bash
   VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   ```
4. Set your private secret in server secrets:
   ```bash
   RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
   ```
5. In Razorpay Webhooks, add webhook URL `https://YOUR_BACKEND/api/razorpay/verify-payment` and subscribe to `payment.captured` and `payment.failed`.

---

## 5. Gemini 3.8 Flash AI Setup

1. In Google AI Studio, ensure your `GEMINI_API_KEY` is present in the Secrets panel.
2. The server-side route `/api/gemini/chat` and Supabase Edge Function `supabase/functions/gemini-assistant/index.ts` both use `gemini-3.8-flash` with a strict system instruction prohibiting hallucinated pricing and enforcing English/Hindi support.

---

## 6. InfinityFree Frontend Deployment Guide

The frontend is built to export cleanly as static HTML, CSS, JavaScript, and assets for InfinityFree:

```bash
# 1. Build the production bundle
npm run build
```

This generates the static files in the `dist/` directory, including the `.htaccess` file for SPA routing.

### Uploading to InfinityFree:
1. Log in to your InfinityFree control panel.
2. Activate your subdomain: `anupfabrication.infinityfree.me`.
3. Open the **Online File Manager** or connect via FTP (e.g. FileZilla using your InfinityFree FTP credentials).
4. Navigate to the document root:
   ```
   /anupfabrication.infinityfree.me/htdocs/
   ```
   *(or `/htdocs/` depending on account layout)*.
5. Upload all contents from the local `dist/` directory directly into `htdocs/`.
   - Make sure `index.html` and `.htaccess` are in the root of `htdocs/`.
6. Enable Free SSL / HTTPS in the InfinityFree SSL certificate manager.
7. Open `https://anupfabrication.infinityfree.me` in your browser to verify.

---

## 7. Security & Production Checklist

- [x] No API secrets in client-side bundles (Gemini key and Razorpay secrets are server-only).
- [x] Row Level Security (RLS) enabled on all Supabase tables.
- [x] Public submissions strictly validated with reference number generation.
- [x] Quotation totals, taxes, and advance calculations computed authoritatively.
- [x] Payment verification checks signatures with HMAC SHA256.
- [x] Full bilingual support with persistent language preference.
- [x] Single Page Application Apache routing fallback configured in `.htaccess`.
