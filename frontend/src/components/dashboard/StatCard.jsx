export default function StatCard({ label, value, icon, accent = 'brand' }) {
  const accentStyles = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-100 p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentStyles[accent]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-extrabold text-surface-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}