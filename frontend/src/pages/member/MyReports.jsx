import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Topbar from '../../components/layout/Topbar';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ReportCard from '../../components/reports/ReportCard';
import { getMyReports } from '../../api/reportApi';

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReports().then((res) => setReports(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <Topbar title="My Reports" subtitle="Your weekly report history"
        action={<Link to="/member/reports/new"><Button>+ New Report</Button></Link>} />
      {loading ? (
        <Loader label="Loading your reports..." />
      ) : reports.length === 0 ? (
        <EmptyState title="No reports yet" description="Create your first weekly report to get started."
          action={<Link to="/member/reports/new"><Button>Create Report</Button></Link>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      )}
    </AppLayout>
  );
}