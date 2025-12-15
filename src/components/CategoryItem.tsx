import { Icon } from '@/shared/ui/icon';

interface CategoryItemProps {
  category: string;
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  const isRetina = window.devicePixelRatio > 1;
  const backgroundImage: string =
    './public/images/categories/' +
    (isRetina ? category.toLowerCase() + '@2x' : category.toLowerCase()) +
    '.jpg';

  return (
    <div
      className="relative flex h-[250px] w-full flex-col justify-end rounded-[30px] bg-cover bg-center bg-no-repeat p-6 md:h-[369px]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 rounded-[30px] bg-[#050505]/20" />
      <div className="relative flex items-center gap-1">
        <p className="flex h-[45px] items-center justify-center rounded-[30px] border border-[#fff]/20 bg-[#fff]/20 px-[14px] py-[10px] text-white">
          {category}
        </p>
        <a
          href="#"
          className="flex size-[45px] items-center justify-center rounded-[30px] border border-[#fff]/20 text-white"
        >
          <Icon size={18} name="arrow-up-right" />
        </a>
      </div>
    </div>
  );
};

export default CategoryItem;
