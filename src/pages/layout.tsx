import { Outlet } from 'react-router-dom';

import { useIsMobile } from '@/shared/hooks/use-is-mobile.hook';
import { BaseInput } from '@/shared/ui/base-input';
import { IconButton } from '@/shared/ui/icon-button';
import { PasswordInput } from '@/shared/ui/password-input';

const Layout = () => {
  const isMobile = useIsMobile();

  console.log(isMobile);

  return (
    <div>
      <header>Header</header>

      <main>
        <Outlet />

        {/* BaseInput Demo */}
        <div
          style={{
            padding: '40px',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '400px',
          }}
        >
          <BaseInput label="Name" required />
          <BaseInput label="Name" defaultValue="Victoria" />
          <BaseInput placeholder="Custom placeholder" />
          <BaseInput label="Email" error="Invalid email address" />
        </div>

        {/* PasswordInput Demo */}
        <div
          style={{
            padding: '40px',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '400px',
          }}
        >
          <PasswordInput />
          <PasswordInput label="Confirm Password" />
          <PasswordInput error="Password is required" />
        </div>

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
