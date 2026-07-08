import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />
      <main className="flex-1 p-5 md:p-8 pb-20 md:pb-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}