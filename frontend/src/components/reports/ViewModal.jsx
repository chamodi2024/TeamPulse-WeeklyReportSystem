export default function ViewModal({ report, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Report Details</h2>
        <div className="space-y-3">
          <p><strong>Project:</strong> {report.projectName}</p>
          <p><strong>Period:</strong> {report.weekStart} to {report.weekEnd}</p>
          <p><strong>Tasks:</strong> {report.tasksCompleted}</p>
          <p><strong>Blockers:</strong> {report.blockers || "None"}</p>
          <p><strong>Hours Worked:</strong> {report.hoursWorked}h</p>
        </div>
        <button 
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}