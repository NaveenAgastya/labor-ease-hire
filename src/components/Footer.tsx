
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-1 rounded-md mr-2">
                <span className="text-white font-bold text-xl">LE</span>
              </div>
              LaborEase
            </h3>
            <p className="text-gray-400 mb-4">
              Connecting skilled laborers with people who need help with everyday tasks. 
              Fast, reliable, and secure.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-primary hover:underline">Home</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-primary hover:underline">Services</Link></li>
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-primary hover:underline">How It Works</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-primary hover:underline">Sign Up</Link></li>
            </ul>
          </div>

          {/* For Laborers */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">For Laborers</h3>
            <ul className="space-y-2">
              <li><Link to="/register?type=laborer" className="text-gray-400 hover:text-primary hover:underline">Join as Laborer</Link></li>
              <li><Link to="/how-to-earn" className="text-gray-400 hover:text-primary hover:underline">How to Earn</Link></li>
              <li><Link to="/laborer-faq" className="text-gray-400 hover:text-primary hover:underline">Laborer FAQ</Link></li>
              <li><Link to="/safety-guidelines" className="text-gray-400 hover:text-primary hover:underline">Safety Guidelines</Link></li>
            </ul>
          </div>

          {/* For Clients */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2">
              <li><Link to="/register?type=client" className="text-gray-400 hover:text-primary hover:underline">Hire Laborers</Link></li>
              <li><Link to="/client-faq" className="text-gray-400 hover:text-primary hover:underline">Client FAQ</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-primary hover:underline">Pricing</Link></li>
              <li><Link to="/guarantee" className="text-gray-400 hover:text-primary hover:underline">Our Guarantee</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LaborEase. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-sm text-gray-400 hover:text-primary">Terms of Service</Link>
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-primary">Privacy Policy</Link>
            <Link to="/contact" className="text-sm text-gray-400 hover:text-primary">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
