import { BaseSelect } from '@/shared/ui/base-select';
import Container from '@/shared/ui/container';
import { MainTitle } from '@/shared/ui/main-title';

import { CategoryDetailsList } from './category-details-list';

type CategoryDetailsProps = {
  title?: string;
};

export const CategoryDetails = ({
  title = 'CATEGORY NAME',
}: CategoryDetailsProps) => {
  return (
    <Container>
      <MainTitle className="mb-16px text-center md:mb-20px">{title}</MainTitle>
      <p>
        Go on a taste journey, where every sip is a sophisticated creative
        chord, and every dessert is an expression of the most refined
        gastronomic desires.
      </p>
      <div className="flex flex-col gap-8 md:gap-8 2xl:flex-row 2xl:gap-10">
        <div className="flex flex-col items-center">
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
        <div className="flex flex-col gap-8">
          <CategoryDetailsList />
        </div>
      </div>
    </Container>
  );
};
