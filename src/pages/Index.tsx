
import { useState } from "react";
import CreateUserForm from "@/components/CreateUserForm";

const Index = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSuccess = () => {
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {isSuccess ? (
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-green-600">Success!</h2>
            <p className="mt-2 text-lg text-gray-600">User was successfully created.</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Create User</h2>
              <p className="mt-2 text-sm text-gray-600">
                Fill in the form below to create a new user
              </p>
            </div>
            <CreateUserForm onSuccess={handleSuccess} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
