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
    <div className={'mb-[64px] md:mb-[79px] 2xl:mb-[120px]'}>
      <Hero />

      {categoryParam ? (
        <CategoryDetails categoryName={categoryParam} />
      ) : (
        <Categories />
      )}
      <Testimonials />
    </div>
  );
};

export default Home;
