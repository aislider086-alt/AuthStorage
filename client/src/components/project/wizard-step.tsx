import { ReactNode } from "react";

interface WizardStepProps {
  step: number;
  currentStep: number;
  title: string;
  children: ReactNode;
}

export default function WizardStep({ step, currentStep, title, children }: WizardStepProps) {
  if (step !== currentStep) {
    return null;
  }

  return (
    <div className="wizard-step" data-testid={`wizard-step-${step}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
      {children}
    </div>
  );
}
