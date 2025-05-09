interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-6 mb-6 relative">
      <div 
        className="bg-blue-500 h-6 rounded-full transition-all duration-300" 
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-700">
        Tarjeta {current} de {total}
      </div>
    </div>
  );
};

export default ProgressBar;