import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/dateHelpers';
import ViewModal from './ViewModal';

export default function ReportCard({ report }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-surface-100 p-5 hover:shadow-card transition">
      
      {/* Card Header (Dates & Project) */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-bold text-surface-900">{formatDate(report.weekStart)} — {formatDate(report.weekEnd)}</p>
          {report.projectName && <p className="text-sm text-brand-600 font-medium mt-0.5">{report.projectName}</p>}
        </div>
        <Badge status={report.status} />
      </div>
      
      {/* Task Completed Details */}
      {report.tasksCompleted && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-2 flex-grow">{report.tasksCompleted}</p>
      )}
      
      {/* Hours and Blockers info */}
      <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 pt-3 border-t border-surface-100">
        {report.hoursWorked && <span>⏱ {report.hoursWorked}h logged</span>}
        {report.blockers && report.blockers !== 'None' && <span className="text-red-500 font-medium">⚠ Has blockers</span>}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-surface-100 flex justify-end gap-4">
        
        {/* View Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View
        </button>

        {/* Edit Button - Only show if status is DRAFT */}
        {report.status === 'DRAFT' && (
          <Link 
            to={`/member/reports/${report.id}/edit`}
            className="text-sm font-semibold text-amber-600 hover:text-amber-800 transition-colors"
          >
            Edit
          </Link>
        )}
        
      </div>

      {/* Modal Component */}
      <ViewModal 
        report={report} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}