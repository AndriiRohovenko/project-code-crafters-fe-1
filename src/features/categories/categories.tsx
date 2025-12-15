import { CategoryList } from '@/features/categories/category-list';
import { MainTitle } from '@/shared/ui/main-title';
import { Subtitle } from '@/shared/ui/subtitle';

export const Categories = () => {
  return (
    <section className="pt-16 md:pt-[100px] xl:pt-[120px]">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 2xl:px-0">
        <div className="flex max-w-[343px] flex-col gap-[22px] max-xl:mx-auto max-md:max-w-[343px] md:max-w-[531px] md:max-xl:max-w-[704px]">
          <MainTitle tag="h2">Categories</MainTitle>
          <Subtitle>
            Discover a limitless world of culinary possibilities and enjoy
            exquisite recipes that combine taste, style and the warm atmosphere
            of the kitchen.
          </Subtitle>
        </div>
        <CategoryList />
      </div>
    </section>
  );
};
