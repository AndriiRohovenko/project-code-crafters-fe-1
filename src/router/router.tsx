import { Route, Routes } from 'react-router-dom';

import AddRecipe from '@/pages/add-recipe';
import Layout from '@/pages/base-layout';
import Categories from '@/pages/categories';
import Home from '@/pages/home';

import { PrivateRouteGuard } from './PrivateRoutGuard';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route element={<PrivateRouteGuard />}>
          <Route path="/add-recipe" element={<AddRecipe />} />
        </Route>
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
