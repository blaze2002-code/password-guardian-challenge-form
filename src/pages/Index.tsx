
import { useState } from "react";
import CreateUserForm from "@/components/CreateUserForm";

const Index = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSuccess = () => {
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {isSuccess ? (
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-green-100 animate-scale-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
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
