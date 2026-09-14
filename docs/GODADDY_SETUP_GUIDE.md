# GoDaddy Venture & Custom Domain Setup Guide

This guide walks you through connecting your **Mannat Matrimony** landing page and web application to your GoDaddy venture domain or GoDaddy hosting.

---

## 🚀 Option 1: Point GoDaddy Custom Domain to Vercel (Recommended & Easiest)

If your app is deployed on Vercel, pointing your GoDaddy domain takes less than 2 minutes:

### Step 1: Open GoDaddy DNS Management
1. Log in to your [GoDaddy Dashboard / Venture Dashboard](https://dashboard.godaddy.com/venture?ventureId=065878c0-bff7-432b-b6a4-54ad5330457c).
2. Click on **Domains** (or **Manage DNS** next to your domain name).

### Step 2: Add DNS Records
In the DNS Records table, set the following records:

| Type | Name / Host | Value / Points To | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | 1 Hour / Automatic |
| **CNAME** | `www` | `cname.vercel-dns.com` | 1 Hour / Automatic |

### Step 3: Add Domain in Vercel
1. In your **Vercel Project Settings** → **Domains**.
2. Add your root domain (e.g. `yourdomain.com`) and `www.yourdomain.com`.
3. Vercel will automatically generate a free SSL certificate (HTTPS) within a few minutes.

---

## 🌐 Option 2: Upload Standalone Landing Page to GoDaddy Web Hosting / cPanel

If you are using GoDaddy Linux Hosting / cPanel / Web Hosting:

1. Locate the standalone landing page file built in this project:
   - `public/landing.html` (or renamed to `index.html`).
2. In GoDaddy cPanel, open **File Manager** → navigate to `public_html/`.
3. Upload `landing.html` (or `index.html`) directly into `public_html/`.
4. Your luxury landing page will be instantly live on your domain.

---

## 🎨 Option 3: Embed in GoDaddy Website Builder (Airo / Venture)

If your GoDaddy Venture uses the **GoDaddy Website Builder**:

1. In your [GoDaddy Venture Dashboard](https://dashboard.godaddy.com/venture?ventureId=065878c0-bff7-432b-b6a4-54ad5330457c), click **Edit Website**.
2. Click **Add Section** (+) → choose **HTML / Custom Code**.
3. Copy the contents of `public/landing.html` into the custom HTML box, or use the custom button to link directly to your live app deployment.
4. Click **Publish**.

---

## 📱 How Visitors Access the Landing Page & App

- **Direct Landing URL**: `https://yourdomain.com/landing` or `https://yourdomain.com/landing.html`
- **In-App Query Parameter**: `https://yourdomain.com/?view=landing`
- **Main App**: Clicking **"Launch Web App"**, **"Enter Mannat"**, or **"Sign In"** on the landing page instantly launches the interactive application.
