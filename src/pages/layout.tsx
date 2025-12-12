import { Outlet } from 'react-router-dom';

import { useIsMobile } from '@/shared/hooks/use-is-mobile.hook';
import { BaseInput } from '@/shared/ui/base-input';
import { BaseSelect } from '@/shared/ui/base-select';
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

        {/* BaseSelect Demo */}
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
          <BaseSelect
            label="Category"
            options={[
              { value: 'beef', label: 'Beef' },
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'desserts', label: 'Desserts' },
              { value: 'lamb', label: 'Lamb' },
              { value: 'miscellaneous', label: 'Miscellaneous' },
              { value: 'pasta', label: 'Pasta' },
              { value: 'pork', label: 'Pork' },
              { value: 'seafood', label: 'Seafood' },
              { value: 'side', label: 'Side' },
              { value: 'starter', label: 'Starter' },
            ]}
          />
          <BaseSelect
            label="Area"
            placeholder="Select area"
            options={[
              { value: 'american', label: 'American' },
              { value: 'british', label: 'British' },
              { value: 'canadian', label: 'Canadian' },
              { value: 'chinese', label: 'Chinese' },
              { value: 'croatian', label: 'Croatian' },
              { value: 'dutch', label: 'Dutch' },
              { value: 'egyptian', label: 'Egyptian' },
              { value: 'french', label: 'French' },
              { value: 'greek', label: 'Greek' },
              { value: 'indian', label: 'Indian' },
            ]}
            defaultValue="french"
          />
          <BaseSelect
            label="Category"
            required
            options={[
              { value: 'beef', label: 'Beef' },
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'desserts', label: 'Desserts' },
            ]}
          />
          <BaseSelect
            label="Category"
            options={[
              { value: 'beef', label: 'Beef' },
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'desserts', label: 'Desserts' },
            ]}
            error="Please select a category"
          />
          <BaseSelect
            label="Category"
            options={[
              { value: 'beef', label: 'Beef' },
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'desserts', label: 'Desserts' },
            ]}
            disabled
          />
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
