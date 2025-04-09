import { CheckIcon } from "lucide-react"

interface Step {
  title: string
  fields: string[]
}

interface StepIndicatorProps {
  currentStep: number
  steps: Step[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              index < currentStep
                ? "bg-green-400 border-none text-primary-foreground"
                : index === currentStep
                  ? "border-primary text-primary"
                  : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
            }`}
          >
            {index < currentStep ? <CheckIcon className="w-5 h-5 text-white" /> : <span>{index + 1}</span>}
          </div>
          <span
            className={`mt-2 text-sm ${
              index <= currentStep ? "text-primary font-medium" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
  )
}
