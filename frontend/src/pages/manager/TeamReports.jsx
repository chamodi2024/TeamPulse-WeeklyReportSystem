import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Topbar from '../../components/layout/Topbar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getTeamReports } from '../../api/reportApi';
import { getAllProjects } from '../../api/projectApi';
import { formatDate } from '../../utils/dateHelpers';

export default function TeamReports() {
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    projectId: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    getAllProjects().then((res) => setProjects(res.data)).catch(() => {});
  }, []);

  const fetchReports = () => {
    setLoading(true);
    const params = {};
    if (filters.projectId) params.projectId = filters.projectId;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    getTeamReports(params)
      .then((res) => setReports(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const clearFilters = () => {
    setFilters({ projectId: '', startDate: '', endDate: '' });
    setTimeout(fetchReports, 0);
  };

  // Distinct team members from loaded reports (for member filter dropdown)
  const uniqueMembers = Array.from(
    new Map(reports.map((r) => [r.userId, r.userName])).entries()
  );

  const [selectedMember, setSelectedMember] = useState('');
  const displayedReports = selectedMember
    ? reports.filter((r) => String(r.userId) === selectedMember)
    : reports;

  return (
    <AppLayout>
      <Topbar title="Team Reports" subtitle="All weekly reports submitted across your team" />

      {/* Filters */}
      <Card className="mb-6">
        <form onSubmit={applyFilters} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Team Member</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All members</option>
              {uniqueMembers.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Project</label>
            <select
              name="projectId"
              value={filters.projectId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">From</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">To</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex gap-2 pt-1">
            <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition">
              Apply Filters
            </button>
            <button type="button" onClick={clearFilters} className="px-4 py-2 text-gray-500 rounded-lg text-sm font-semibold hover:bg-surface-100 transition">
              Clear
            </button>
          </div>
        </form>
      </Card>

      {loading ? (
        <Loader label="Loading team reports..." />
      ) : displayedReports.length === 0 ? (
        <EmptyState title="No reports found" description="Try adjusting your filters, or check back after your team submits reports." />
      ) : (
        <Card noPadding className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 text-left text-xs uppercase text-gray-400">
                <th className="px-5 py-3 font-semibold">Member</th>
                <th className="px-5 py-3 font-semibold">Week</th>
                <th className="px-5 py-3 font-semibold">Project</th>
                <th className="px-5 py-3 font-semibold">Hours</th>
                <th className="px-5 py-3 font-semibold">Blockers</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedReports.map((r) => (
                <tr key={r.id} className="border-b border-surface-50 hover:bg-surface-50/50">
                  <td className="px-5 py-3.5 font-medium text-surface-900">{r.userName}</td>
                  <td className="px-5 py-3.5 text-gray-600">{formatDate(r.weekStart)} – {formatDate(r.weekEnd)}</td>
                  <td className="px-5 py-3.5 text-gray-600">{r.projectName || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-600">{r.hoursWorked ? `${r.hoursWorked}h` : '—'}</td>
                  <td className="px-5 py-3.5">
                    {r.blockers && r.blockers !== 'None' ? (
                      <span className="text-red-500 text-xs font-medium">⚠ {r.blockers.slice(0, 30)}{r.blockers.length > 30 ? '…' : ''}</span>
                    ) : (
                      <span className="text-gray-400 text-xs">None</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5"><Badge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </AppLayout>
  );
}