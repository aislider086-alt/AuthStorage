interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  "Brand Info",
  "Project Details", 
  "Asset Upload",
  "Review"
];

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div>
      <div className="flex space-x-4 mb-3">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          
          return (
            <div key={step} className="flex items-center space-x-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isActive || isCompleted
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
                data-testid={`step-indicator-${step}`}
              >
                {step}
              </div>
              <span 
                className={`text-sm font-medium ${
                  isActive 
                    ? 'text-primary-600'
                    : isCompleted
                      ? 'text-gray-900'
                      : 'text-gray-500'
                }`}
                data-testid={`step-label-${step}`}
              >
                {stepLabels[index]}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          data-testid="progress-bar"
        ></div>
      </div>
    </div>
  );
}
