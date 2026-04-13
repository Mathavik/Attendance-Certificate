import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="w-full bg-white pointer-events-none">
      <div className="px-8 py-6 flex items-center">
        <img src="/images/logo.png" alt="PCS Logo" className="h-12 w-auto" />
      </div>
      <div className="h-0.5 w-full bg-pink-600" />
    </div>
  );
};

export default Header;
