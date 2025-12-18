import { BaseSelect } from '@/shared/ui/base-select';
import { MainTitle } from '@/shared/ui/main-title';

import { CategoryDetailsList } from './category-details-list';

export const CategoryDetails = () => {
  return (
    <>
      <MainTitle className="mb-16 text-center md:mb-20">TESTIMONIALS</MainTitle>
      <p>
        Go on a taste journey, where every sip is a sophisticated creative
        chord, and every dessert is an expression of the most refined
        gastronomic desires.
      </p>
      <div className="flex flex-col gap-8 md:gap-8 2xl:flex-row 2xl:gap-10">
        <div className="w-full shrink-0 2xl:w-[550px]">
          <BaseSelect
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
            ]}
          ></BaseSelect>
          <BaseSelect
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
            ]}
          ></BaseSelect>
        </div>
        <div className="w-full">
          <CategoryDetailsList />
        </div>
      </div>
    </>
  );
};
