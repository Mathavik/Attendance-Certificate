import React, { useState } from 'react';
import { SavedCertificate } from '../pages/certificate';

type AdminDashboardProps = {
  certificateStats: Array<{ certificateTitle: string; count: number }>;
  adminCertificates: SavedCertificate[];
  saveStatus: string;
  onLoadSaved: () => void;
  onLoadIntoEditor: (c: SavedCertificate) => void;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  certificateStats,
  adminCertificates,
  saveStatus,
  onLoadSaved,
  onLoadIntoEditor,
}) => {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(''); // Month filter state
  const [selectedYear, setSelectedYear] = useState<string>('');   // Year filter state

  // 1. Available Years - DD.MM.YYYY string-il irunthu split panni unique values edukirom
  const availableYears = Array.from(
    new Set(
      adminCertificates
        .map((c) => {
          if (!c.date) return null;
          const parts = c.date.split('.'); // [ "30", "03", "2026" ]
          return parts.length === 3 ? parts[2] : null; // Year-ah mattum thookrom
        })
        .filter((year): year is string => year !== null)
    )
  ).sort();

  // Month list labels
  const monthsList = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // 2. Main Filtering Logic - Direct String Splitting
  const filteredCertificates = adminCertificates.filter((c) => {
    // 🛑 KEEZHA IRUKURA TABLE DATA-LA ATTENDANCE CERTIFICATE VENDAAM
    if (c.certificateTitle === 'ATTENDANCE CERTIFICATE') return false;

    if (!c.date) return false;
    
    const parts = c.date.split('.'); // split by dot
    if (parts.length !== 3) return false;

    const certMonth = parts[1]; // '03'
    const certYear = parts[2];  // '2026'

    const matchesTitle = selectedTitle ? c.certificateTitle === selectedTitle : true;
    const matchesYear = selectedYear ? certYear === selectedYear : true;
    const matchesMonth = selectedMonth ? certMonth === selectedMonth : true;

    return matchesTitle && matchesYear && matchesMonth;
  });

  // Ellaa filter-aiyum reset panna handy function
  const clearAllFilters = () => {
    setSelectedTitle(null);
    setSelectedMonth('');
    setSelectedYear('');
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Admin Dashboard</h2>
          <p className="text-sm text-slate-600">Load saved certificates and review stored entries.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLoadSaved} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">🔄 Load Saved</button>
          {saveStatus && <span className="text-sm text-slate-700">{saveStatus}</span>}
        </div>
      </div>

      {/* Date Filters (Month & Year Dropdowns) */}
      <div className="mt-6 flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filter Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filter Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Months</option>
            {monthsList.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {(selectedTitle || selectedYear || selectedMonth) && (
          <button
            onClick={clearAllFilters}
            className="mt-5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 transition-all"
          >
            ❌ Clear All Filters
          </button>
        )}
      </div>

      {/* Certificate Stats */}
      {certificateStats.length > 0 && (
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {certificateStats
            .filter((stat) => stat.certificateTitle !== 'ATTENDANCE CERTIFICATE') // 🛑 STATS CARD-LAYUM VENDAAM
            .map((stat) => (
              <div
                key={stat.certificateTitle}
                onClick={() => setSelectedTitle(selectedTitle === stat.certificateTitle ? null : stat.certificateTitle)}
                className={`rounded-lg p-4 text-center cursor-pointer transition-all ${selectedTitle === stat.certificateTitle ? 'bg-blue-500 text-white shadow-lg scale-105' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                <p className={`text-xs uppercase font-semibold ${selectedTitle === stat.certificateTitle ? 'text-white' : 'text-slate-600'}`}>{stat.certificateTitle}</p>
                <p className={`text-2xl font-bold ${selectedTitle === stat.certificateTitle ? 'text-white' : 'text-blue-900'}`}>{stat.count}</p>
              </div>
            ))}
        </div>
      )}

      {filteredCertificates.length === 0 ? (
        <div className="mt-6 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl text-center border border-dashed border-slate-200">
          No certificates found matching the selected filters.
          {(selectedTitle || selectedYear || selectedMonth) && (
            <button
              onClick={clearAllFilters}
              className="ml-2 text-blue-600 font-semibold underline hover:text-blue-800"
            >
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          {/* Active Filter Indicators */}
          {(selectedTitle || selectedYear || selectedMonth) && (
            <div className="mb-3 flex items-center justify-between bg-blue-50/50 px-3 py-2 rounded-lg text-sm text-slate-700">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-semibold">Active Filters:</span>
                {selectedTitle && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{selectedTitle}</span>}
                {selectedYear && <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs">Year: {selectedYear}</span>}
                {selectedMonth && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                    Month: {monthsList.find(m => m.value === selectedMonth)?.label}
                  </span>
                )}
              </div>
            </div>
          )}

          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-800">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">ID</th>
                <th className="px-3 py-2 text-left font-semibold">Student</th>
                <th className="px-3 py-2 text-left font-semibold">College</th>
                <th className="px-3 py-2 text-left font-semibold">Certificate</th>
                <th className="px-3 py-2 text-left font-semibold">From</th>
                <th className="px-3 py-2 text-left font-semibold">To</th>
                <th className="px-3 py-2 text-left font-semibold">Date</th>
                <th className="px-3 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredCertificates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2">{c.id}</td>
                  <td className="px-3 py-2">{c.studentName}</td>
                  <td className="px-3 py-2">{c.collegeName}</td>
                  <td className="px-3 py-2">{c.certificateTitle}</td>
                  <td className="px-3 py-2">{c.fromDate}</td>
                  <td className="px-3 py-2">{c.toDate}</td>
                  <td className="px-3 py-2 font-medium text-slate-600">{c.date}</td>
                  <td className="px-3 py-2">
                    <button onClick={() => onLoadIntoEditor(c)} className="text-xs bg-emerald-600 hover:bg-emerald-700 transition-colors text-white px-2 py-1 rounded">Load</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;