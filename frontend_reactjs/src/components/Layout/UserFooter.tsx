import React from 'react';

const UserFooter: React.FC = () => {
  return (
    <footer className="py-8 px-8 border-t border-gray-100 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-sm font-medium text-gray-400">
          © 2026 <span className="text-brand-primary font-semibold">KSI Project</span>. All rights reserved.
        </p>
        <div className="flex items-center space-x-8">
          <a href="#" className="text-xs font-semibold text-gray-400 hover:text-brand-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs font-semibold text-gray-400 hover:text-brand-primary transition-colors">Terms of Service</a>
          <a href="#" className="text-xs font-semibold text-gray-400 hover:text-brand-primary transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
