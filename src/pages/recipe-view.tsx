import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getRecipesByid } from '@/api/api.gen';
import RecipeInfo from '@/features/recipe-info/recipe-info';
import { RecipeDetail } from '@/shared/types/recipe';
import Container from '@/shared/ui/container';
import Loader from '@/shared/ui/loader';

const RecipeView = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const recipeData = await getRecipesByid(Number(id));
        setRecipe(recipeData as RecipeDetail);
      } catch (err) {
        console.error('Failed to load recipe:', err);
        setError('Failed to load recipe. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="py-8">
        <Container>
          <div className="text-center text-red-500">{error}</div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8">
      <Container>
        <RecipeInfo recipe={recipe} />
      </Container>
    </section>
  );
};

export default RecipeView;
