import React from 'react'

export const MessageSkeleton = () => {
    return (
        <div
            className="w-full text-[#545454] py-4 roboto-font "
            
        >
            {[...Array(5)].map((_, index) => (
                <div key={index}>
                    <div className="py-4 animate-pulse">
                        {/* Subject + Date */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                            <div className="h-4 bg-gray-200 rounded w-48" />
                            <div className="h-4 bg-gray-200 rounded w-24 shrink-0" />
                        </div>

                        {/* Message */}
                        <div className="mt-3 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-[90%]" />
                        </div>
                    </div>

                    <hr className="border-t border-[#cac9c9]" />
                </div>
            ))}
        </div>
    )
}
