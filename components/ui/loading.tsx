interface LoadingProps {
  type?: 'spinner' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  subtitle?: string;
  color?: 'blue' | 'green' | 'gray';
  fullScreen?: boolean;
}

export default function Loading({
  type = 'spinner',
  size = 'md',
  text = 'Loading...',
  subtitle,
  color = 'blue',
  fullScreen = false
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-32 w-32'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    gray: 'border-gray-600'
  };

  const renderSpinner = () => (
    <div className={`animate-spin rounded-full border-b-2 ${colorClasses[color]} ${sizeClasses[size]} mx-auto mb-4`}></div>
  );

  const renderDots = () => (
    <div className="flex space-x-2 justify-center mb-4">
      <div className={`animate-bounce w-3 h-3 bg-${color}-600 rounded-full`}></div>
      <div className={`animate-bounce w-3 h-3 bg-${color}-600 rounded-full`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`animate-bounce w-3 h-3 bg-${color}-600 rounded-full`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`animate-pulse rounded-full bg-${color}-600 ${sizeClasses[size]} mx-auto mb-4`}></div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className="text-center">
      {renderLoader()}
      <p className="text-gray-600 text-lg font-medium">{text}</p>
      {subtitle && (
        <p className="text-gray-500 text-sm mt-2">{subtitle}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
} 