import { Outlet } from 'react-router-dom';

import { useIsMobile } from '@/shared/hooks/use-is-mobile.hook';
import { IconButton } from '@/shared/ui/icon-button';

const Layout = () => {
  const isMobile = useIsMobile();

  console.log(isMobile);

  return (
    <div>
      <header>Header</header>

      <main>
        <Outlet />

        {/* IconButton Demo */}
        <div
          style={{
            padding: '40px',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <IconButton iconName="arrow-up-right" size="small" />
          <IconButton iconName="arrow-up-right" size="medium" />
          <IconButton iconName="arrow-up-right" size="large" />
          <IconButton iconName="heart" size="large" type="base" />
        </div>
      </main>

      <footer>Footer</footer>
    </div>
  );
};

export default Layout;
