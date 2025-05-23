
import React, { useState, useEffect, useRef } from "react";
import PasswordCriteria from "@/components/PasswordCriteria";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CreateUserFormProps {
  onSuccess: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  // Refs for focus management
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);

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

  // Get criteria that are not met
  const failedCriteria = passwordCriteria.filter((criteria) => !criteria.test(password));

  // Shift focus to the error alert when it appears
  useEffect(() => {
    if (apiError && errorAlertRef.current) {
      errorAlertRef.current.focus();
    }
  }, [apiError]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset any previous error
    setApiError(null);

    // Form validation
    if (!username.trim()) {
      setApiError("Username is required");
      usernameInputRef.current?.focus();
      return;
    }

    if (!isPasswordValid) {
      passwordInputRef.current?.focus();
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

      // Handle different response statuses with exact error messages as required
      if (response.ok) {
        toast({
          title: "Success",
          description: "User created successfully!",
          duration: 3000,
        });
        onSuccess();
      } else if (response.status === 400) {
        // Specific error for common passwords - using exact wording
        setApiError("Sorry, the entered password is not allowed, please try a different one.");
      } else if (response.status === 401 || response.status === 403) {
        // Authentication error - using exact wording
        setApiError("Not authenticated to access this resource.");
      } else {
        // Generic error - using exact wording
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Keyboard handling for password visibility toggle
  const handleToggleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePasswordVisibility();
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
      <div className="bg-white py-8 px-6 shadow-lg sm:rounded-xl border border-gray-100">
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {apiError && (
            <Alert 
              variant="destructive" 
              className="animate-scale-in border-red-200 bg-red-50"
              ref={errorAlertRef}
              tabIndex={-1}
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <AlertTitle className="sr-only">Error</AlertTitle>
              <AlertDescription className="text-sm text-red-700 font-medium">{apiError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              ref={usernameInputRef}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
              aria-invalid={!username.trim()}
              aria-describedby={!username.trim() ? "username-error" : undefined}
            />
            {!username.trim() && (
              <p id="username-error" className="mt-1 text-sm text-red-600" role="alert">Username is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                ref={passwordInputRef}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 pr-10"
                aria-invalid={password.length > 0 && !isPasswordValid}
                aria-describedby="password-criteria"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                onKeyDown={handleToggleKeyDown}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            
            {password.length > 0 && (
              <div className="mt-2 p-3 bg-amber-50 rounded-md border border-amber-100 animate-fade-in">
                <PasswordCriteria 
                  criteria={passwordCriteria} 
                  password={password}
                />
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting || !username.trim() || !isPasswordValid}
              className={`w-full py-2.5 ${
                isSubmitting || !username.trim() || !isPasswordValid
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center`}
              aria-disabled={isSubmitting || !username.trim() || !isPasswordValid}
            >
              {isSubmitting ? "Creating..." : (
                <>
                  Create User
                  {isPasswordValid && username.trim() && <Check className="ml-2 h-4 w-4" aria-hidden="true" />}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
