import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Topbar from '../../components/layout/Topbar';
import ReportForm from '../../components/reports/ReportForm';
import { createReport, createAndSubmitReport } from '../../api/reportApi';

export default function NewReport() {
  const [submitting, setSubmitting] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (payload, submitNow) => {
    setError('');
    setSubmitting(submitNow ? 'submit' : 'draft');
    try {
      if (submitNow) await createAndSubmitReport(payload);
      else await createReport(payload);
      navigate('/member/reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save report. Please check your inputs.');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <AppLayout>
      <Topbar title="New Weekly Report" subtitle="Fill in your progress for this week" />
      {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl mb-5 text-sm">{error}</div>}
      <ReportForm onSubmit={handleSubmit} submitting={submitting} />
    </AppLayout>
  );
}