import React from 'react';

interface ConfidenceMeterProps {
  confidence: number; // 0.0 to 1.0
  level?: 'High' | 'Medium' | 'Low' | string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'circular' | 'linear';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  level = 'High',
  size = 'md',
  variant = 'circular',
}) => {
  const percent = Math.min(100, Math.max(0, Math.round(confidence * 100)));
  const normLevel = level.toLowerCase();

  let strokeColor = '#2D6A4F'; // agri-700
  let bgColor = '#E8F2E6';
  let textColor = 'text-agri-800';

  if (normLevel === 'medium' || (percent >= 55 && percent < 80)) {
    strokeColor = '#E28743';
    bgColor = '#FEEDD1';
    textColor = 'text-warning-600';
  } else if (normLevel === 'low' || percent < 55) {
    strokeColor = '#D9534F';
    bgColor = '#FEE2E2';
    textColor = 'text-danger-600';
  }

  if (variant === 'linear') {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center text-xs font-semibold mb-1">
          <span className="text-gray-600">Model Certainty</span>
          <span className={textColor}>{percent}% ({level})</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 border border-gray-200">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${percent}%`,
              backgroundColor: strokeColor,
            }}
          />
        </div>
      </div>
    );
  }

  // Circular Meter
  const dimensions = {
    sm: { width: 64, stroke: 5, fontSize: 'text-sm' },
    md: { width: 96, stroke: 7, fontSize: 'text-xl' },
    lg: { width: 128, stroke: 9, fontSize: 'text-2xl' },
  }[size];

  const radius = (dimensions.width - dimensions.stroke * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative flex items-center justify-center">
        <svg
          width={dimensions.width}
          height={dimensions.width}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={radius}
            stroke={bgColor}
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Foreground meter circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold ${dimensions.fontSize} ${textColor} leading-none`}>
            {percent}%
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-700 tracking-wider mt-0.5">
            {level}
          </span>
        </div>
      </div>
    </div>
  );
};
