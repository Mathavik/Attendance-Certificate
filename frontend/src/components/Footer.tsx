import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t-2 border-pink-600 pointer-events-none">
      <div className="px-8 py-4 grid grid-cols-3 gap-8 text-xs border-b border-pink-600">
        <div>
          <p className="font-bold text-pink-600 uppercase text-xs tracking-wider">PLACE</p>
          <p className="text-slate-700 mt-2 text-xs leading-relaxed">PM Complex, Sankarankovil Road, Sangeeetha Mobiles Upstairs, Gurandai, Tenkasi, Tamil Nadu - 627859</p>
        </div>
        <div>
          <p className="font-bold text-pink-600 uppercase text-xs tracking-wider">CONNECT</p>
          <p className="text-slate-700 mt-2 text-xs">📞 +91 93633 75667</p>
          <p className="text-slate-700 text-xs">📱 +91 87547 68231</p>
          <p className="text-slate-700 text-xs">✉️ contact@pstech.in</p>
        </div>
        <div>
          <p className="font-bold text-pink-600 uppercase text-xs tracking-wider">SEARCH</p>
          <p className="text-slate-700 mt-2 text-xs font-semibold">www.pstech.in</p>
          <div className="flex gap-1 mt-1 text-xs">
            <span>🔗</span>
            <span>💼</span>
            <span>📘</span>
            <span>🐦</span>
            <span>/pstechsurandai</span>
          </div>
        </div>
      </div>
      <div className="h-3 bg-blue-900" />
    </footer>
  );
};

export default Footer;
