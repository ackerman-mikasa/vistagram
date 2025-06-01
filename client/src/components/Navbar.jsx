import { Link } from 'react-router-dom';
import { CameraIcon, HomeIcon } from '@heroicons/react/24/outline';

function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Vistagram
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <HomeIcon className="h-6 w-6" />
              <span>Timeline</span>
            </Link>
            
            <Link
              to="/upload"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <CameraIcon className="h-6 w-6" />
              <span>Upload</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 