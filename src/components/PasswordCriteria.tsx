
import React from "react";

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
    <div className="mt-2">
      <ul className="list-disc pl-5 text-sm text-red-600" role="alert">
        {criteria.map((criterion) => (
          <li key={criterion.id}>{criterion.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordCriteria;
