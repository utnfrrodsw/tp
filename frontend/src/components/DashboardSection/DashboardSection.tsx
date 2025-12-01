type DashboardSectionProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

function DashboardSection({ children, className = "", title }: DashboardSectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {title && <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>}
      {children}
    </div>
  );
}

export default DashboardSection;
