import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md mt-auto">
      <span className="text-gray-600 dark:text-gray-300 text-sm">&copy; {currentYear} Site</span>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300">Privacy Policy</a></li>
          <li><a href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300">Terms of Service</a></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
