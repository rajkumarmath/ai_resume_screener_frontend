import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileText, BrainCircuit, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Resumes', href: '/dashboard/resumes', icon: FileText },
    { name: 'AI Match', href: '/dashboard/match', icon: BrainCircuit },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-black text-blue-600 flex items-center gap-2">
          <BrainCircuit className="w-6 h-6" /> ResumeAI
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <Icon className="w-5 h-5" /> {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}