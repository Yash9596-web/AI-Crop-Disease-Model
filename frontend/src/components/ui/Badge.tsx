import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface SeverityBadgeProps {
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Healthy' | string;
  className?: string;
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  className = '',
  showIcon = true,
}) => {
  const norm = severity.toLowerCase();

  if (norm === 'healthy') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}>
        {showIcon && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
        Healthy Crop
      </span>
    );
  }

  if (norm === 'mild') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 ${className}`}>
        {showIcon && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
        Mild Severity
      </span>
    );
  }

  if (norm === 'moderate') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-900 border border-orange-300 ${className}`}>
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />}
        Moderate Severity
      </span>
    );
  }

  // Severe
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-900 border border-red-300 ${className}`}>
      {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
      Severe Infestation
    </span>
  );
};

interface ConfidenceBadgeProps {
  confidence: number;
  level?: 'High' | 'Medium' | 'Low' | string;
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  level = 'High',
  className = '',
}) => {
  const percent = Math.round(confidence * 100);
  const normLevel = level.toLowerCase();

  let colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (normLevel === 'medium' || (percent >= 55 && percent < 80)) {
    colorClasses = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (normLevel === 'low' || percent < 55) {
    colorClasses = 'bg-gray-100 text-gray-800 border-gray-300';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorClasses} ${className}`}>
      <ShieldCheck className="w-3 h-3" />
      {percent}% Confidence
    </span>
  );
};
