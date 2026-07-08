import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import AppLayout from '../../components/layout/AppLayout';
import Topbar from '../../components/layout/Topbar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/dashboard/StatCard';
import ChatWidget from '../../components/dashboard/ChatWidget';
import {
  getSummary, getSubmissionStatus, getTaskTrend,
  getWorkloadDistribution, getRecentActivity,
} from '../../api/dashboardApi';
import { getCurrentWeekStart, getWeekEnd, formatDate, formatDateTime } from '../../utils/dateHelpers';

const COLORS = ['#5568ef', '#f4930c', '#3d47e0', '#fab324', '#a3b8fc', '#fde08a'];

export default function Dashboard() {
  const [weekStart] = useState(getCurrentWeekStart());
  const [weekEnd] = useState(getWeekEnd(getCurrentWeekStart()));
  const [summary, setSummary] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState([]);
  const [taskTrend, setTaskTrend] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSummary(weekStart, weekEnd),
      getSubmissionStatus(weekStart, weekEnd),
      getTaskTrend(),
      getWorkloadDistribution(),
      getRecentActivity(),
    ])
      .then(([s, st, tt, w, ra]) => {
        setSummary(s.data);
        setSubmissionStatus(st.data);
        setTaskTrend(tt.data);
        setWorkload(w.data);
        setRecentActivity(ra.data);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <AppLayout><Loader label="Loading dashboard..." /></AppLayout>;

  const trendByWeek = Object.values(
    taskTrend.reduce((acc, item) => {
      const key = item.weekStart;
      if (!acc[key]) acc[key] = { weekStart: key, taskCount: 0 };
      acc[key].taskCount += item.taskCount;
      return acc;
    }, {})
  ).sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));

  return (
    <AppLayout>
      <Topbar title="Dashboard" subtitle={`Team overview for ${formatDate(weekStart)} — ${formatDate(weekEnd)}`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Reports this week" value={summary.totalReportsThisWeek} accent="brand"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
        <StatCard label="Compliance rate" value={`${summary.complianceRate}%`} accent="green"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard label="Pending submissions" value={summary.pendingCount} accent="amber"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard label="Open blockers" value={summary.openBlockersCount} accent="red"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <Card>
          <h3 className="font-bold text-surface-900 mb-4">Tasks Completed Trend</h3>
          {trendByWeek.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">Not enough data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendByWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e6f0" />
                <XAxis dataKey="weekStart" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip labelFormatter={formatDate} />
                <Line type="monotone" dataKey="taskCount" stroke="#5568ef" strokeWidth={2.5} dot={{ r: 4 }} name="Reports logged" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="font-bold text-surface-900 mb-4">Submission Status by Member</h3>
          {submissionStatus.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No team members found</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={submissionStatus.map((s) => ({ name: s.userName, value: s.status === 'SUBMITTED' ? 1 : 0, status: s.status }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e6f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis hide domain={[0, 1]} />
                <Tooltip formatter={(_, __, props) => [props.payload.status, 'Status']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {submissionStatus.map((s, idx) => (
                    <Cell key={idx} fill={s.status === 'SUBMITTED' ? '#3d9e6e' : s.status === 'LATE' ? '#e14b4b' : '#fab324'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="font-bold text-surface-900 mb-4">Workload by Project</h3>
          {workload.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No project data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={workload} dataKey="reportCount" nameKey="projectName" cx="50%" cy="50%" outerRadius={80} label={(entry) => entry.projectName}>
                  {workload.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="font-bold text-surface-900 mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No recent submissions</p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {recentActivity.map((r) => (
                <div key={r.id} className="flex items-start gap-3 pb-3 border-b border-surface-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs flex-shrink-0">
                    {r.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-surface-900 truncate">{r.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{r.project?.name || 'No project'} · {formatDateTime(r.submittedAt)}</p>
                  </div>
                  <Badge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <ChatWidget />
    </AppLayout>
  );
}