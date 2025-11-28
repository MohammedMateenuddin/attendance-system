# Live Attend

A modern, geolocation-based attendance management system built with Next.js, TailwindCSS, and PostgreSQL.

## Features

- **Professor Dashboard**: Create secure sessions, track live attendees, and export PDF reports.
- **Student Portal**: Mark attendance using geolocation (must be within radius).
- **Proxy Prevention**: Geofencing and device fingerprinting.
- **Live Updates**: Real-time attendee list updates.
- **Mobile Responsive**: Optimized for all devices.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Vercel Postgres / Neon)
- **ORM**: Prisma
- **Styling**: TailwindCSS
- **Deployment**: Vercel

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd attendance-system
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file with your database credentials:
    ```env
    POSTGRES_PRISMA_URL="your_connection_string"
    POSTGRES_URL_NON_POOLING="your_direct_url"
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

This project is optimized for deployment on **Vercel**.

1.  Push to GitHub.
2.  Import project in Vercel.
3.  Connect Vercel Postgres database.
4.  Deploy!
