const STYLES = {
  DRAFT: 'bg-gray-100 text-gray-600',
  SUBMITTED: 'bg-green-50 text-green-700',
  LATE: 'bg-red-50 text-red-600',
  PENDING: 'bg-amber-50 text-amber-700',
};

export default function Badge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}