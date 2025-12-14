import React from 'react';

interface LiveStreamBadgeProps {
    isLive: boolean;
    streamUrl?: string;
    platform?: 'youtube' | 'vimeo' | 'facebook' | 'custom';
    viewerCount?: number;
    className?: string;
}

export function LiveStreamBadge({
    isLive,
    streamUrl,
    platform = 'youtube',
    viewerCount,
    className = ''
}: LiveStreamBadgeProps) {
    if (!isLive) return null;

    const platformIcons = {
        youtube: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        vimeo: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
            </svg>
        ),
        facebook: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        custom: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
    };

    return (
        <div className={`inline-flex items-center ${className}`}>
            <a
                href={streamUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
                {/* Animated pulse effect */}
                <span className="absolute inset-0 rounded-lg bg-red-400 opacity-75 animate-ping"></span>

                {/* Content */}
                <span className="relative flex items-center gap-2">
                    {/* Live indicator dot */}
                    <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>

                    {/* Live text */}
                    <span className="font-bold text-sm uppercase tracking-wider">
                        Live Now
                    </span>

                    {/* Platform icon */}
                    <span className="opacity-90">
                        {platformIcons[platform]}
                    </span>

                    {/* Viewer count */}
                    {viewerCount !== undefined && viewerCount > 0 && (
                        <span className="ml-1 text-xs opacity-90">
                            {formatViewerCount(viewerCount)}
                        </span>
                    )}

                    {/* Arrow icon */}
                    <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </span>
            </a>
        </div>
    );
}

function formatViewerCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M watching`;
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K watching`;
    } else {
        return `${count} watching`;
    }
}
