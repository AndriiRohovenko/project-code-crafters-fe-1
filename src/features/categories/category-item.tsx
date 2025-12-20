import { useNavigate } from 'react-router-dom';

import { Icon } from '@/shared/ui/icon';

interface CategoryItemProps {
  category: string;
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  const navigate = useNavigate();
  const isRetina = window.devicePixelRatio > 1;

  // Public assets resolve under BASE_URL in preview/build; normalize name to match files
  const normalizedName = category.toLowerCase().replace(/\s+/g, '-');
  const fileName = `${normalizedName}${isRetina ? '@2x' : ''}.jpg`;
  const backgroundImage = `${import.meta.env.BASE_URL}images/categories/${fileName}`;

  const handleCategoryClick = () => {
    // Use normalized name as slug
    navigate(`/?category=${encodeURIComponent(normalizedName)}`);
  };

  return (
    <div
      className="relative flex h-[250px] w-full flex-col justify-end rounded-[30px] bg-cover bg-center bg-no-repeat p-6 md:h-[369px]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 rounded-[30px] bg-[#050505]/30" />
      <div className="relative flex items-center gap-1">
        <p className="flex h-[45px] items-center justify-center rounded-[30px] border border-[#fff]/20 bg-[#fff]/20 px-[14px] py-[10px] text-white">
          {category}
        </p>
        <button
          onClick={handleCategoryClick}
          className="flex size-[45px] items-center justify-center rounded-[30px] border border-[#fff]/20 text-white transition-colors hover:bg-[#fff]/10"
        >
          <Icon size={18} name="arrow-up-right" />
        </button>
      </div>
    </div>
  );
};
