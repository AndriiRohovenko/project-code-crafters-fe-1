import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Loader from '@/shared/ui/loader';

const Layout = lazy(() => import('@/pages/base-layout'));
const Home = lazy(() => import('@/pages/home'));
const AddRecipe = lazy(() => import('@/pages/add-recipe'));
const RecipeView = lazy(() => import('@/pages/recipe-view'));
const Categories = lazy(() => import('@/pages/categories'));
const Profile = lazy(() => import('@/pages/profile'));

import { PrivateRouteGuard } from './PrivateRoutGuard';

const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loader />}>
              <Layout />
            </Suspense>
          }
        >
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
          <Route
            path="*"
            element={
              <div className="p-10 text-center text-xl">
                404 - Page Not Found
              </div>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
