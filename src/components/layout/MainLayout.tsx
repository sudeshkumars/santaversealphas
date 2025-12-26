import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { Snowfall } from '../Snowfall';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background">
      <Snowfall />
      <AppSidebar />
      <div className="ml-64">
        <Header />
        <main className="relative z-10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
