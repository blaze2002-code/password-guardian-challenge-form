
import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface Criterion {
  id: string;
  message: string;
  test: (password: string) => boolean;
}

interface PasswordCriteriaProps {
  criteria: Criterion[];
  password: string; // Add password prop to check which criteria are met
}

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({ criteria, password }) => {
  if (criteria.length === 0) {
    return null;
  }

  return (
    <div className="text-sm" role="alert" aria-live="polite">
      <h3 className="font-medium mb-1.5 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1.5" /> 
        Password Requirements
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        {criteria.map((criterion) => {
          const isMet = criterion.test(password);
          return (
            <li 
              key={criterion.id} 
              className={isMet ? "text-green-600 flex items-center" : "text-amber-800"}
            >
              {isMet && <CheckCircle className="h-3 w-3 mr-1" />}
              {criterion.message}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordCriteria;
