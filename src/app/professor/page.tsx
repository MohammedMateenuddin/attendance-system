'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaUsers, FaDownload, FaStopCircle, FaCopy, FaClock } from 'react-icons/fa';

export default function ProfessorDashboard() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        professorName: '',
        courseCode: '',
        radius: 50,
        durationMinutes: 1,
    });
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [copySuccess, setCopySuccess] = useState('');

    const createSession = async () => {
        setLoading(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const res = await fetch('/api/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...formData,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }),
                    });

                    if (!res.ok) throw new Error('Failed to create session');
                    const data = await res.json();
                    setSession(data);
                } catch (err) {
                    setError('Error creating session');
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError('Unable to retrieve location: ' + err.message);
                setLoading(false);
            }
        );
    };

    const refreshSession = async () => {
        if (!session) return;
        try {
            const res = await fetch(`/api/session/${session.id}`);
            if (res.ok) {
                const data = await res.json();
                if (data && !data.error) {
                    setSession(data);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (session && session.isActive) {
            interval = setInterval(refreshSession, 10000);
        }
        return () => clearInterval(interval);
    }, [session]);

    useEffect(() => {
        if (!session || !session.expiresAt || !session.isActive) {
            setTimeLeft('');
            return;
        }

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const expires = new Date(session.expiresAt).getTime();
            const diff = expires - now;

            if (diff <= 0) {
                setTimeLeft('Expired');
                clearInterval(timer);
            } else {
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [session]);

    const stopSession = async () => {
        if (!session) return;
        try {
            await fetch(`/api/session/${session.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: false }),
            });
            refreshSession();
        } catch (err) {
            console.error(err);
        }
    };

    const copyToClipboard = async () => {
        const link = `${window.location.origin}/student/${session.id}`;
        try {
            await navigator.clipboard.writeText(link);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const savePDF = async () => {
        if (!session?.attendees) return;

        try {
            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;

            const doc = new jsPDF();

            // Add title
            doc.setFontSize(16);
            doc.text(`Attendance Report: ${session.courseCode}`, 14, 20);

            doc.setFontSize(10);
            doc.text(`Professor: ${session.professorName}`, 14, 30);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
            doc.text(`Total Attendees: ${session.attendees.length}`, 14, 40);

            const tableColumn = ["Name", "Roll Number", "Time"];
            const tableRows = session.attendees.map((att: any) => [
                att.studentName,
                att.rollNumber,
                new Date(att.timestamp).toLocaleTimeString()
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 50,
            });

            doc.save(`attendance-${session.courseCode}-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error('PDF generation error:', err);
            alert('Failed to save PDF');
        }
    };

    const isExpired = session?.expiresAt && new Date() > new Date(session.expiresAt);
    const status = !session?.isActive ? 'Closed' : isExpired ? 'Expired' : 'Active';

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 relative overflow-hidden font-sans">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-[-10%] right-[20%] w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[30%] w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-sm">
                    Professor Dashboard
                </h1>

                {!session ? (
                    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-2xl shadow-2xl">
                        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Create New Session</h2>
                        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm text-center">{error}</div>}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Professor Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Dr. Smith"
                                    className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                    value={formData.professorName}
                                    onChange={(e) => setFormData({ ...formData, professorName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Course Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. CS101"
                                    className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                    value={formData.courseCode}
                                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Radius (m)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                        value={formData.radius}
                                        onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Duration (min)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                        value={formData.durationMinutes}
                                        onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={createSession}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-3 rounded-lg font-bold shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                            >
                                <FaMapMarkerAlt /> {loading ? 'Creating...' : 'Start Session'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Session Info Card */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{session.courseCode}</h2>
                                    <p className="text-purple-200">Professor: {session.professorName}</p>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                                        <span className="bg-black/30 px-2 py-1 rounded">ID: {session.id}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border
                                        ${status === 'Active' ? 'bg-green-500/20 border-green-500/50 text-green-300' :
                                            status === 'Expired' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' :
                                                'bg-red-500/20 border-red-500/50 text-red-300'}`}>
                                        {status}
                                    </span>
                                    {session.expiresAt && status === 'Active' && (
                                        <div className="flex items-center gap-2 text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/30">
                                            <FaClock className="text-xs" />
                                            <span className="font-mono font-bold">{timeLeft}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Link Sharing */}
                            <div className="bg-black/30 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/5">
                                <code className="font-mono text-sm text-gray-300 break-all">
                                    {window.location.origin}/student/{session.id}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-blue-600/80 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <FaCopy /> {copySuccess || 'Copy Link'}
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                {session.isActive && (
                                    <button
                                        onClick={stopSession}
                                        className="bg-red-500/80 hover:bg-red-600 px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
                                    >
                                        <FaStopCircle /> Stop Session
                                    </button>
                                )}
                                <button
                                    onClick={savePDF}
                                    className="bg-emerald-600/80 hover:bg-emerald-600 px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg ml-auto"
                                >
                                    <FaDownload /> Save Attendance
                                </button>
                            </div>
                        </div>

                        {/* Attendees List */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                <FaUsers className="text-purple-400" />
                                Live Attendees
                                <span className="bg-purple-500/20 text-purple-300 text-sm px-2 py-0.5 rounded-full ml-2">
                                    {session.attendees?.length || 0}
                                </span>
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-gray-400 text-sm uppercase tracking-wider">
                                            <th className="p-3 font-medium">Name</th>
                                            <th className="p-3 font-medium">Roll No</th>
                                            <th className="p-3 font-medium">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {session.attendees?.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-gray-500 italic">
                                                    Waiting for students to join...
                                                </td>
                                            </tr>
                                        ) : (
                                            session.attendees?.map((attendee: any) => (
                                                <tr key={attendee.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-3 font-medium text-white">{attendee.studentName}</td>
                                                    <td className="p-3 text-gray-300">{attendee.rollNumber}</td>
                                                    <td className="p-3 text-gray-400 font-mono text-xs">
                                                        {new Date(attendee.timestamp).toLocaleTimeString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
