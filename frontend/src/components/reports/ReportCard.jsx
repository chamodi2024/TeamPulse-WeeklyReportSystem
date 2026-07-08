import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/dateHelpers';

export default function ReportCard({ report }) {
  return (
    <Link to={report.status === 'DRAFT' ? `/member/reports/${report.id}/edit` : `#`}
      className="block bg-white rounded-2xl border border-surface-100 p-5 hover:shadow-card transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-bold text-surface-900">{formatDate(report.weekStart)} — {formatDate(report.weekEnd)}</p>
          {report.projectName && <p className="text-sm text-brand-600 font-medium mt-0.5">{report.projectName}</p>}
        </div>
        <Badge status={report.status} />
      </div>
      {report.tasksCompleted && <p className="text-sm text-gray-600 line-clamp-2 mb-2">{report.tasksCompleted}</p>}
      <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 pt-3 border-t border-surface-100">
        {report.hoursWorked && <span>⏱ {report.hoursWorked}h logged</span>}
        {report.blockers && report.blockers !== 'None' && <span className="text-red-500 font-medium">⚠ Has blockers</span>}
      </div>
    </Link>
  );
}