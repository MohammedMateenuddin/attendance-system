🎯 Radius – Geo-Fenced Attendance System

Radius is a modern web-based attendance system that uses geo-fencing to ensure students can mark attendance only if they are within 100 meters of the classroom.
It removes manual roll-calls, prevents proxy attendance, and gives teachers a clean, real-time interface to manage sessions effortlessly.

🔗 Live Demo: https://attendance-system-ochre-ten.vercel.app/

🚀 Tech Stack: React, Vite, Tailwind CSS, Supabase, Lucide-React

📌 Features
👨‍🏫 For Professors

Start an attendance session instantly

Session remains active until stopped

See which students marked attendance

Real-time updates (powered by Supabase)

🎓 For Students

Mark attendance only when within 100 meters

Automatically detects location

Clean and simple UI

⚙️ System Features

Supabase Auth (Email)

Real-time database updates

Secure API interactions

Deployed on Vercel

Works on mobile & desktop

🛠 Tech Stack

Frontend: React + Vite

Styling: Tailwind CSS

Backend: Supabase (Auth, DB, Realtime)

Icons: Lucide-React

Geo-Location: Browser Geolocation API + Haversine Formula

📂 Project Structure
src/
│── components/
│── pages/
│── hooks/
│── utils/
│── supabase/
│── App.jsx
│── main.jsx

🚀 Getting Started
1️⃣ Clone the Repo
git clone https://github.com/your-username/radius-attendance.git
cd radius-attendance

2️⃣ Install Dependencies
npm install

3️⃣ Add Environment Variables

Create a .env file:

VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

4️⃣ Run the App
npm run dev

📈 Future Improvements

Admin dashboard

Analytics & attendance reports

QR-code based fallback

Offline → online sync

Mobile app (React Native / Flutter)

🤝 Contributions

Pull requests, issues, and suggestions are always welcome!
