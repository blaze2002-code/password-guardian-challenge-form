
import React, { useState, useEffect } from "react";
import PasswordCriteria from "@/components/PasswordCriteria";
import { useToast } from "@/hooks/use-toast";

interface CreateUserFormProps {
  onSuccess: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { toast } = useToast();

  // Challenge token from URL
  const getChallengeToken = () => {
    // In a real scenario, this would be extracted from the /challenge-details URL parameter
    // For this challenge, you would replace this with the actual token extraction logic
    return window.location.pathname.split("/").pop() || "";
  };

  // Password validation criteria
  const passwordCriteria = [
    { id: "length-min", message: "Password must be at least 10 characters long", test: (pw: string) => pw.length >= 10 },
    { id: "length-max", message: "Password must be at most 24 characters long", test: (pw: string) => pw.length <= 24 },
    { id: "no-spaces", message: "Password cannot contain spaces", test: (pw: string) => !pw.includes(" ") },
    { id: "has-number", message: "Password must contain at least one number", test: (pw: string) => /\d/.test(pw) },
    { id: "has-uppercase", message: "Password must contain at least one uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
    { id: "has-lowercase", message: "Password must contain at least one lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  ];

  // Check if password is valid
  const isPasswordValid = passwordCriteria.every((criteria) => criteria.test(password));

  // Filter criteria that are not met
  const failedCriteria = passwordCriteria.filter((criteria) => !criteria.test(password));

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset any previous error
    setApiError(null);

    // Form validation
    if (!username.trim()) {
      setApiError("Username is required");
      return;
    }

    if (!isPasswordValid) {
      return; // Don't submit if password is invalid
    }

    setIsSubmitting(true);

    try {
      const token = getChallengeToken();
      const response = await fetch("https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      // Handle different response statuses
      if (response.ok) {
        onSuccess();
      } else if (response.status === 400) {
        // Specific error for common passwords
        setApiError("Sorry, the entered password is not allowed, please try a different one.");
      } else if (response.status === 401 || response.status === 403) {
        // Authentication error
        setApiError("Not authenticated to access this resource.");
      } else {
        // Generic error
        setApiError("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setApiError("Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset API error on form changes
  useEffect(() => {
    if (apiError) {
      setApiError(null);
    }
  }, [username, password]);

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {apiError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{apiError}</div>
            </div>
          )}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                aria-invalid={!username.trim()}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                aria-invalid={password.length > 0 && !isPasswordValid}
              />
            </div>
            
            {password.length > 0 && failedCriteria.length > 0 && (
              <PasswordCriteria criteria={failedCriteria} />
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !username.trim() || !isPasswordValid}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
