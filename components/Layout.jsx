
import { useState } from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileNav from './MobileNav';

export default function Layout({ children }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex min-h-screen bg-white dark:bg-twitter-dark">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 lg:w-72 xl:w-80 border-r border-gray-200 dark:border-gray-800">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 border-x border-gray-200 dark:border-gray-800 max-w-2xl">
        {children}
      </main>
      
      {/* Right Sidebar - Trends, Who to follow */}
      <div className="hidden lg:block lg:w-80 xl:w-96">
        <RightSidebar />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav showMenu={showMobileMenu} setShowMenu={setShowMobileMenu} />
    </div>
  );
}
