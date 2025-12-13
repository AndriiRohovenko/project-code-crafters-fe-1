import { Outlet } from 'react-router-dom';

import { Footer } from '@/shared/widgets/footer';
import { Header } from '@/shared/widgets/header';

const Layout = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
