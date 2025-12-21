import { Route, Routes } from 'react-router-dom';

import AddRecipe from '@/pages/add-recipe';
import Layout from '@/pages/base-layout';
import Categories from '@/pages/categories';
import Home from '@/pages/home';
import Profile from '@/pages/profile';
import RecipeView from '@/pages/recipe-view';
import UserProfile from '@/pages/user-profile';

import { PrivateRouteGuard } from './PrivateRoutGuard';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="/add-recipe"
          element={
            <PrivateRouteGuard>
              <AddRecipe />
            </PrivateRouteGuard>
          }
        />
        <Route path="/recipe/:id" element={<RecipeView />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/profile"
          element={
            <PrivateRouteGuard>
              <Profile />
            </PrivateRouteGuard>
          }
        />
        <Route path="/users/:id" element={<UserProfile />} />
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
