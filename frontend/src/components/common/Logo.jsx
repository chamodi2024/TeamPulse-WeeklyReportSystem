export default function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-lg ${
        light ? 'bg-white text-brand-700' : 'bg-brand-600 text-white'
      }`}>
        T
      </div>
      <span className={`font-extrabold text-xl tracking-tight ${light ? 'text-white' : 'text-surface-900'}`}>
        TeamPulse
      </span>
    </div>
  );
}