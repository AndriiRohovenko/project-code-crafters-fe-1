import { Categories } from '@/features/categories/categories';
// import { ProfileFollowPanel } from '@/features/profile/ui/profile-follow-panel';
import Hero from '@/features/hero/hero.tsx';

import { Testimonials } from '../features/testimonials/testimonials';

const Home = () => {
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
      <Categories />
      <Testimonials />
    </div>
  );
};

export default Home;
