import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Topbar from '../../components/layout/Topbar';
import ReportForm from '../../components/reports/ReportForm';
import Loader from '../../components/common/Loader';
import { getReportById, updateReport, submitReport } from '../../api/reportApi';

export default function EditReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getReportById(id).then((res) => setReport(res.data)).catch(() => setError('Report not found.'));
  }, [id]);

  const handleSubmit = async (payload, submitNow) => {
    setError('');
    setSubmitting(submitNow ? 'submit' : 'draft');
    try {
      await updateReport(id, payload);
      if (submitNow) await submitReport(id);
      navigate('/member/reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update report.');
    } finally {
      setSubmitting(null);
    }
  };

  if (!report && !error) return <AppLayout><Loader label="Loading report..." /></AppLayout>;

  return (
    <AppLayout>
      <Topbar title="Edit Weekly Report" subtitle={`Editing report for ${report?.weekStart} — ${report?.weekEnd}`} />
      {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl mb-5 text-sm">{error}</div>}
      {report && <ReportForm initialData={report} onSubmit={handleSubmit} submitting={submitting} />}
    </AppLayout>
  );
}