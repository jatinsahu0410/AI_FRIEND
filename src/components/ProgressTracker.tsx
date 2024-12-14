import React from 'react';

interface ProgressTrackerProps {
    currentStep: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep }) => {
    return (
        <div className="flex flex-col items-center space-y-2 w-full mb-2">
            {/* Progress Line */}
            <div className="relative w-full max-w-lg h-2 bg-gray-700 rounded-full">
                <div
                    className="absolute top-0 left-0 h-full bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 2) * 100}%` }}
                ></div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between w-full max-w-lg">
                {Array.from({ length: 2 }, (_, index) => (
                    <div key={index} className="relative flex flex-col items-center">
                        <div
                            className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-sm font-semibold ${currentStep >= index + 1 ? 'bg-purple-500' : 'bg-gray-500'
                                }`}
                        >
                            {index + 1}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressTracker;
