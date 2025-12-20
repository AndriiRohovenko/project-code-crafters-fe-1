import { AddRecipeForm } from '@/features/add-recipe/add-recipe-form';
import { Breadcrumbs } from '@/features/bredcrumbs/breadcrumbs.tsx';
import Container from '@/shared/ui/container';
import { MainTitle } from '@/shared/ui/main-title';
import { Subtitle } from '@/shared/ui/subtitle';

const AddRecipe = () => {
  return (
    <Container>
      <div className="mt-8">
        <Breadcrumbs name={'Add recipe'} />
        <MainTitle className="mb-2">Add recipe</MainTitle>
        <Subtitle className="text-black/70 mb-10 max-w-[360px] md:max-w-[480px]">
          Reveal your culinary art, share your favorite recipe and create
          gastronomic masterpieces with us.
        </Subtitle>

        <AddRecipeForm />
      </div>
    </Container>
  );
};

export default AddRecipe;
