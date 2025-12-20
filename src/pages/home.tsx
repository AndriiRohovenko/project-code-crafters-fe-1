import { useSearchParams } from 'react-router-dom';

import { Categories } from '@/features/categories/categories';
import { CategoryDetails } from '@/features/category-details/category-details';
// import { ProfileFollowPanel } from '@/features/profile/ui/profile-follow-panel';
import Hero from '@/features/hero/hero.tsx';

import { Testimonials } from '../features/testimonials/testimonials';

const Home = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  return (
    <div>
      <Hero />

      <section className="xl:pt-[120px] pt-16 md:pt-[100px]">
        {/* <div className="mx-auto xs:w-[343px] md:w-[704px] 2xl:w-[846px]">

      <section className="xl:pt-[120px] pt-16 md:pt-[100px]">
        <div className="mx-auto xs:w-[343px] md:w-[704px] 2xl:w-[846px]">
>>>>>>> origin/main
          <h2>followers</h2>
          <ProfileFollowPanel tab="followers" />
        </div>
        <div className="mx-auto xs:w-[343px] md:w-[704px] 2xl:w-[846px]">
          <h2>following</h2>
          <ProfileFollowPanel tab="following" />
        </div> */}
      </section>
      <CategoryDetails />
      {categoryParam ? (
        <section className="xl:pt-[120px] pt-16 md:pt-[100px]">
          <div className="mx-auto max-w-[1280px] px-4 md:px-8 2xl:px-0">
            <h2 className="mb-4 text-2xl font-bold">Recipes Filter Section</h2>
            <p className="text-lg">
              Showing recipes for category: {categoryParam}
            </p>
          </div>
        </section>
      ) : (
        <Categories />
      )}
      <Testimonials />
    </div>
  );
};

export default Home;
