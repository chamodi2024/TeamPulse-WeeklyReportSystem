export default function Card({ children, className = '', noPadding = false }) {
  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-surface-100 ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
}