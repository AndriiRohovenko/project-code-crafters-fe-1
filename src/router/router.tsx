import { Route, Routes } from 'react-router-dom';

import Categories from '@/pages/categories';
import Home from '@/pages/home';
import Layout from '@/pages/layout';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="*"
          element={
            <div className="p-10 text-center text-xl">404 - Page Not Found</div>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRouter;
