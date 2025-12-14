import React, { useState } from 'react';
import { updateStreamStatus, extractVideoId } from '../lib/api';

interface LiveStreamManagerProps {
    sermonId: string;
    currentStatus?: 'offline' | 'scheduled' | 'live' | 'ended';
    liveStreamUrl?: string;
    streamPlatform?: 'youtube' | 'vimeo' | 'facebook' | 'custom';
    scheduledTime?: string;
}

export function LiveStreamManager({
    sermonId,
    currentStatus = 'offline',
    liveStreamUrl = '',
    streamPlatform = 'youtube',
    scheduledTime = '',
}: LiveStreamManagerProps) {
    const [status, setStatus] = useState(currentStatus);
    const [url, setUrl] = useState(liveStreamUrl);
    const [platform, setPlatform] = useState(streamPlatform);
    const [scheduled, setScheduled] = useState(scheduledTime);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleGoLive = async () => {
        if (!url) {
            setMessage('Please enter a stream URL first');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // Extract video ID from URL
            const videoId = extractVideoId(url, platform);

            // Update sermon status to live
            const { error } = await updateStreamStatus(sermonId, 'live');

            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setStatus('live');
                setMessage('✅ Stream is now LIVE!');
            }
        } catch (error) {
            setMessage('Failed to start stream');
        } finally {
            setLoading(false);
        }
    };

    const handleEndStream = async () => {
        if (!confirm('Are you sure you want to end the live stream?')) {
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const { error } = await updateStreamStatus(sermonId, 'ended');

            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setStatus('ended');
                setMessage('Stream ended successfully');
            }
        } catch (error) {
            setMessage('Failed to end stream');
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async () => {
        if (!url || !scheduled) {
            setMessage('Please enter both stream URL and scheduled time');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const { error } = await updateStreamStatus(sermonId, 'scheduled');

            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setStatus('scheduled');
                setMessage('✅ Stream scheduled successfully!');
            }
        } catch (error) {
            setMessage('Failed to schedule stream');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = () => {
        const badges = {
            offline: <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">⚫ Offline</span>,
            scheduled: <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">🕐 Scheduled</span>,
            live: <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium animate-pulse">🔴 LIVE</span>,
            ended: <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">⏹️ Ended</span>,
        };
        return badges[status];
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Live Stream Control</h3>
                {getStatusBadge()}
            </div>

            {/* Message Display */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${message.startsWith('✅')
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : message.startsWith('Error')
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                    {message}
                </div>
            )}

            {/* Stream URL Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream URL
                </label>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={status === 'live'}
                />
            </div>

            {/* Platform Selector */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {(['youtube', 'vimeo', 'facebook', 'custom'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPlatform(p)}
                            disabled={status === 'live'}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${platform === p
                                    ? 'border-primary-600 bg-primary-50 text-primary-800 font-semibold'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                } ${status === 'live' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scheduled Time */}
            {status !== 'live' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scheduled Time (Optional)
                    </label>
                    <input
                        type="datetime-local"
                        value={scheduled}
                        onChange={(e) => setScheduled(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                {status === 'offline' || status === 'ended' ? (
                    <>
                        <button
                            onClick={handleGoLive}
                            disabled={loading || !url}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                '🔴 Go Live Now'
                            )}
                        </button>
                        {scheduled && (
                            <button
                                onClick={handleSchedule}
                                disabled={loading || !url}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                            >
                                📅 Schedule Stream
                            </button>
                        )}
                    </>
                ) : status === 'live' ? (
                    <button
                        onClick={handleEndStream}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                    >
                        {loading ? 'Ending...' : '⏹️ End Stream'}
                    </button>
                ) : status === 'scheduled' ? (
                    <>
                        <button
                            onClick={handleGoLive}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                        >
                            🔴 Go Live Now
                        </button>
                        <button
                            onClick={async () => {
                                await updateStreamStatus(sermonId, 'offline');
                                setStatus('offline');
                                setMessage('Schedule cancelled');
                            }}
                            disabled={loading}
                            className="px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Cancel
                        </button>
                    </>
                ) : null}
            </div>

            {/* Stream Preview */}
            {status === 'live' && url && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Stream Preview</h4>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-all"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Live Stream
                    </a>
                </div>
            )}

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                    💡 <strong>Tip:</strong> Paste your YouTube, Vimeo, or Facebook Live URL above.
                    The system will automatically detect the platform and extract the video ID.
                </p>
            </div>
        </div>
    );
}
