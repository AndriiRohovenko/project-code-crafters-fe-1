import { Outlet } from 'react-router-dom';

import { Footer } from '@/shared/widgets/footer';

const Layout = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header>Header</header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
