import { Outlet } from 'react-router-dom';

import { Icon, IconName } from '../uikit/icon';

const allIconNames: IconName[] = [
  'arrow-up-right',
  'burger',
  'camera',
  'check-active',
  'check-empty',
  'close',
  'down',
  'eye-off',
  'eye',
  'facebook',
  'heart',
  'icon-back',
  'icon-github',
  'icon-linkedin',
  'instagram',
  'logo',
  'minus',
  'plus',
  'quote',
  'trash',
  'up',
  'youtube',
];

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-2xl font-bold text-indigo-600">Logo</span>
            </div>
            <nav className="flex space-x-4">
              <a
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                Home
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />

        {/* Icon Gallery */}
        <section className="mt-12 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Icon Gallery
          </h2>
          <div className="grid grid-cols-4 gap-6 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {allIconNames.map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-indigo-300 hover:bg-indigo-50"
              >
                <Icon name={name} className="h-8 w-8 text-gray-700" />
                <span className="text-center text-xs text-gray-500">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
