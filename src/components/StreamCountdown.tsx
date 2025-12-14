import React, { useState, useEffect } from 'react';

interface StreamCountdownProps {
    scheduledTime: string; // ISO 8601 datetime string
    streamUrl?: string;
    onCountdownComplete?: () => void;
    className?: string;
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

export function StreamCountdown({
    scheduledTime,
    streamUrl,
    onCountdownComplete,
    className = ''
}: StreamCountdownProps) {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const calculateTimeRemaining = (): TimeRemaining => {
            const now = new Date().getTime();
            const target = new Date(scheduledTime).getTime();
            const difference = target - now;

            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
            }

            return {
                total: difference,
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };

        // Initial calculation
        const initial = calculateTimeRemaining();
        setTimeRemaining(initial);

        if (initial.total <= 0) {
            setIsComplete(true);
            onCountdownComplete?.();
            return;
        }

        // Update every second
        const interval = setInterval(() => {
            const remaining = calculateTimeRemaining();
            setTimeRemaining(remaining);

            if (remaining.total <= 0) {
                setIsComplete(true);
                onCountdownComplete?.();
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [scheduledTime, onCountdownComplete]);

    if (isComplete) {
        return (
            <div className={`bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg p-6 shadow-lg ${className}`}>
                <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                        <span className="flex h-4 w-4 mr-2">
                            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                        </span>
                        <h3 className="text-2xl font-bold">Stream is Starting!</h3>
                    </div>
                    {streamUrl && (
                        <a
                            href={streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
                        >
                            Watch Now
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        );
    }

    if (!timeRemaining) {
        return null;
    }

    const scheduledDate = new Date(scheduledTime);
    const formattedDate = scheduledDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
    });

    return (
        <div className={`bg-gradient-to-br from-primary-800 to-primary-900 text-white rounded-lg p-6 shadow-lg ${className}`}>
            <div className="text-center mb-6">
                <div className="inline-flex items-center px-3 py-1 bg-primary-700 rounded-full text-sm font-medium mb-3">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Upcoming Live Stream
                </div>
                <h3 className="text-xl font-bold mb-1">{formattedDate}</h3>
                <p className="text-primary-200">{formattedTime}</p>
            </div>

            {/* Countdown Display */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <CountdownUnit value={timeRemaining.days} label="Days" />
                <CountdownUnit value={timeRemaining.hours} label="Hours" />
                <CountdownUnit value={timeRemaining.minutes} label="Minutes" />
                <CountdownUnit value={timeRemaining.seconds} label="Seconds" />
            </div>

            {/* Notify Me Button */}
            <div className="text-center">
                <button
                    onClick={() => {
                        // TODO: Implement notification subscription
                        alert('Notification feature coming soon!');
                    }}
                    className="inline-flex items-center px-6 py-3 bg-white text-primary-800 rounded-lg font-semibold hover:bg-primary-50 transition-all shadow-md hover:shadow-lg"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notify Me
                </button>
            </div>
        </div>
    );
}

interface CountdownUnitProps {
    value: number;
    label: string;
}

function CountdownUnit({ value, label }: CountdownUnitProps) {
    return (
        <div className="bg-primary-700 bg-opacity-50 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold mb-1 tabular-nums">
                {value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-primary-200 uppercase tracking-wide">
                {label}
            </div>
        </div>
    );
}
