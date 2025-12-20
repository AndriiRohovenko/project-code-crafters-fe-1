import { useNavigate } from 'react-router-dom';

export const CategoryItemAll = () => {
  const navigate = useNavigate();

  const handleAllCategoriesClick = () => {
    navigate('/?category=all');
  };

  return (
    <div className="flex h-[250px] w-full flex-col rounded-[30px] bg-[#050505] bg-cover bg-center bg-no-repeat p-6 md:h-[369px]">
      <button
        className="flex size-full items-center justify-center transition-opacity hover:opacity-80"
        onClick={handleAllCategoriesClick}
      >
        <span className="text-xl font-extrabold text-white">
          ALL CATEGORIES
        </span>
      </button>
    </div>
  );
};
