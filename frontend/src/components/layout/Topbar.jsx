import Logo from '../common/Logo';

export default function Topbar({ title, subtitle, action }) {
  return (
    <div className="mb-6">
      <div className="md:hidden mb-4">
        <Logo />
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}