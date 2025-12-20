import { Categories } from '@/features/categories/categories';
import Hero from '@/features/hero/hero.tsx';
import { ProfileFollowPanel } from '@/features/profile/ui/profile-follow-panel';
import { CategoryDetails } from '@/features/category-details/category-details';
import { Testimonials } from '@/features/testimonials/testimonials';

const Home = () => {
  return (
    <div>
      <Hero />
      <section className="xl:pt-[120px] pt-16 md:pt-[100px]">
        <div className="mx-auto xs:w-[343px] md:w-[704px] 2xl:w-[846px]">
          <h2>followers</h2>
          <ProfileFollowPanel tab="followers" />
        </div>
        <div className="mx-auto xs:w-[343px] md:w-[704px] 2xl:w-[846px]">
          <h2>following</h2>
          <ProfileFollowPanel tab="following" />
        </div>
      </section>
      <Categories />
      <CategoryDetails />
      <Testimonials />
    </div>
  );
};

export default Home;
