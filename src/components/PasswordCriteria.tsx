
import React from "react";
import { AlertCircle } from "lucide-react";

interface Criterion {
  id: string;
  message: string;
  test: (password: string) => boolean;
}

interface PasswordCriteriaProps {
  criteria: Criterion[];
}

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({ criteria }) => {
  if (criteria.length === 0) {
    return null;
  }

  return (
    <div className="text-sm text-amber-700" role="alert">
      <h3 className="font-medium mb-1.5 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1.5" /> 
        Password Requirements
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        {criteria.map((criterion) => (
          <li key={criterion.id} className="text-amber-800">
            {criterion.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordCriteria;
