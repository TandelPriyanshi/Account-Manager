import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Account Manager</h1>
      <p className="text-xl text-gray-600 mb-8">
        {isAuthenticated
          ? 'Manage your account details easily.'
          : 'Please log in or register to get started.'}
      </p>
      
      <div className="mt-10">
        {isAuthenticated ? (
          <Link
            to="/account"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            Go to My Account
          </Link>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
