
import React from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface Criterion {
  id: string;
  message: string;
  test: (password: string) => boolean;
}

interface PasswordCriteriaProps {
  criteria: Criterion[];
  password: string;
}

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({ criteria, password }) => {
  if (criteria.length === 0) {
    return null;
  }

  return (
    <div className="text-sm" role="alert" aria-live="polite">
      <h3 className="font-medium mb-1.5 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1.5 text-amber-700" /> 
        Password Requirements
      </h3>
      <ul className="list-none space-y-1.5">
        {criteria.map((criterion) => {
          const isMet = criterion.test(password);
          return (
            <li 
              key={criterion.id} 
              className={`flex items-center ${isMet ? "text-green-600" : "text-amber-800"}`}
            >
              {isMet ? (
                <CheckCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              ) : (
                <X className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              )}
              <span>{criterion.message}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordCriteria;
