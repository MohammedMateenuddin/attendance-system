'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function StudentPage() {
    const params = useParams();
    const sessionId = params.sessionId as string;

    const [status, setStatus] = useState<'idle' | 'locating' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        studentName: '',
        rollNumber: '',
    });

    const submitAttendance = async () => {
        if (!formData.studentName || !formData.rollNumber) {
            setMessage('Please fill in all fields');
            setStatus('error');
            return;
        }

        setStatus('locating');
        setMessage('Getting your location...');

        if (!navigator.geolocation) {
            setMessage('Geolocation is not supported by your browser');
            setStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                setStatus('submitting');
                setMessage('Submitting attendance...');

                try {
                    const res = await fetch('/api/attendance', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            sessionId: sessionId,
                            studentName: formData.studentName,
                            rollNumber: formData.rollNumber,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            deviceFingerprint: 'browser-fingerprint', // Placeholder
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to mark attendance');
                    }

                    setStatus('success');
                    setMessage('Attendance marked successfully!');
                } catch (err: any) {
                    setStatus('error');
                    setMessage(err.message);
                }
            },
            (err) => {
                setStatus('error');
                setMessage('Unable to retrieve location: ' + err.message);
            }
        );
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
                <div className="bg-green-900/30 border border-green-500 p-8 rounded-lg text-center max-w-md w-full">
                    <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Success!</h2>
                    <p>{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
            <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Mark Attendance</h1>

                {status === 'error' && (
                    <div className="bg-red-900/30 border border-red-500 p-4 rounded mb-4 flex items-center gap-2">
                        <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                        <p className="text-sm">{message}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                            value={formData.studentName}
                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                            disabled={status === 'locating' || status === 'submitting'}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Roll Number</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                            value={formData.rollNumber}
                            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                            disabled={status === 'locating' || status === 'submitting'}
                        />
                    </div>

                    <button
                        onClick={submitAttendance}
                        disabled={status === 'locating' || status === 'submitting'}
                        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                        {status === 'locating' || status === 'submitting' ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <FaMapMarkerAlt /> Submit Attendance
                            </>
                        )}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        Location access is required to mark attendance.
                    </p>
                </div>
            </div>
        </div>
    );
}
