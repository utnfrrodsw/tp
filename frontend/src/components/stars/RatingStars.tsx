import { useState } from 'react';

interface Props {
  initialRating?: number;
  onChange: (rating: number) => void;
  size?: number;
  className?: string;
}

function StarRating({
  initialRating = 0,
  onChange,
  size = 25,
  className = '',
}: Props) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleMouseEnter = (starIndex: number, isHalf: boolean) => {
    const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;
    setHoverRating(newRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (starIndex: number, isHalf: boolean) => {
    const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;
    setRating(newRating);
    onChange(newRating);
  };

  const getStarFillPercentage = (starIndex: number): number => {
    const currentRating = hoverRating || rating;
    if (currentRating >= starIndex + 1) {
      return 100;
    } else if (currentRating > starIndex) {
      const percentage = (currentRating - starIndex) * 100;
      return Math.min(100, Math.max(0, percentage));
    }
    return 0;
  };

  const StarIcon = ({ starIndex }: { starIndex: number }) => {
    const fillPercentage = getStarFillPercentage(starIndex);
    const gradientId = `gradient-${starIndex}`;

    return (
      <div className="relative inline-block cursor-pointer">
        <svg
          width={`${size}px`}
          height={`${size}px`}
          viewBox="0 -0.02 60.031 60.031"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-150 ease-in-out"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset={`${fillPercentage}%`} stopColor="#bf873e" />
              <stop offset={`${fillPercentage}%`} stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${gradientId})`}
            fillRule="evenodd"
            d="M828.776,237.723l-11.4,8.657a3,3,0,0,0-.993,1.3,2.948,2.948,0,0,0-.162,1.618l3.078,17.135a3,3,0,0,1-1.275,3.011,3.161,3.161,0,0,1-3.326.147l-13.174-7.409a3.156,3.156,0,0,0-3.09,0L785.257,269.6a3.164,3.164,0,0,1-1.55.4,3.13,3.13,0,0,1-1.777-.551,3,3,0,0,1-1.274-3.011l3.076-17.135a2.929,2.929,0,0,0-.16-1.618,3,3,0,0,0-.993-1.3l-11.4-8.657a3,3,0,0,1-1.117-3.085,3.069,3.069,0,0,1,2.391-2.285l14.654-2.967a3.129,3.129,0,0,0,1.28-.577,3.02,3.02,0,0,0,.885-1.074l7.914-16.018a3.131,3.131,0,0,1,5.586,0l7.91,16.018a3.028,3.028,0,0,0,.884,1.074,3.162,3.162,0,0,0,1.281.577l14.655,2.967a3.07,3.07,0,0,1,2.394,2.285A3,3,0,0,1,828.776,237.723Z"
            transform="translate(-769.969 -210)"
            stroke="#d1d5db"
            strokeWidth="1"
          />
        </svg>

        {/* Áreas de hover para media y completa estrella */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full cursor-pointer"
          onMouseEnter={() => handleMouseEnter(starIndex, true)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(starIndex, true)}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-full cursor-pointer"
          onMouseEnter={() => handleMouseEnter(starIndex, false)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(starIndex, false)}
        />
      </div>
    );
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} starIndex={index} />
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {(hoverRating || rating).toFixed(1)} / {5}
      </span>
    </div>
  );
}

// Componente de ejemplo para mostrar el uso

export default StarRating;
