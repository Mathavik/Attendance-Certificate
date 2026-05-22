import React from 'react';
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
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Admin Dashboard</h2>
          <p className="text-sm text-slate-600">Load saved certificates and review stored entries.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLoadSaved} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">🔄 Load Saved</button>
          {saveStatus && <span className="text-sm text-slate-700">{saveStatus}</span>}
        </div>
      </div>

      {/* Certificate Stats */}
      {certificateStats.length > 0 && (
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {certificateStats.map((stat) => (
            <div key={stat.certificateTitle} className="rounded-lg bg-slate-100 p-4 text-center">
              <p className="text-xs text-slate-600 uppercase font-semibold">{stat.certificateTitle}</p>
              <p className="text-2xl font-bold text-blue-900">{stat.count}</p>
            </div>
          ))}
        </div>
      )}

      {adminCertificates.length === 0 ? (
        <div className="mt-4 text-sm text-slate-700">No saved certificates loaded.</div>
      ) : (
        <div className="mt-4 overflow-x-auto">
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
              </tr>
            </thead>
            <tbody className="bg-white">
              {adminCertificates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2">{c.id}</td>
                  <td className="px-3 py-2">{c.studentName}</td>
                  <td className="px-3 py-2">{c.collegeName}</td>
                  <td className="px-3 py-2">{c.certificateTitle}</td>
                  <td className="px-3 py-2">{c.fromDate}</td>
                  <td className="px-3 py-2">{c.toDate}</td>
                  <td className="px-3 py-2">{c.date}</td>
                  <td className="px-3 py-2">
                    <button onClick={() => onLoadIntoEditor(c)} className="text-xs bg-emerald-600 text-white px-2 py-1 rounded">Load</button>
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
