import Tooltip from './Tooltip';

interface CardPagoProps {
  title: string;
  value: string;
  color: 'green' | 'blue' | 'orange' | 'purple';
  icon: React.ReactNode;
}

function CardPago({ title, value, color, icon }: CardPagoProps) {
  const colorClasses = {
    green: {
      text: 'text-green-600',
      bg: 'bg-green-100'
    },
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    orange: {
      text: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  };

  const colors = colorClasses[color];
  const tooltipContent = value
  const displayText = value

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 relative overflow-visible">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <Tooltip content={tooltipContent}>
            <p className={`text-xl sm:text-2xl font-bold ${colors.text} truncate cursor-help`}>
              {displayText}
            </p>
          </Tooltip>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
          <div className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPago;
