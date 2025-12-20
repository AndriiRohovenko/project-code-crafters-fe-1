import { Icon } from '@/shared/ui/icon';

interface RecipePreviewItemProps {
  preview: string | undefined;
  title: string | undefined;
  description: string | undefined;
  author: {
    name: string | undefined;
    avatar: string | undefined;
  };
}

export const RecipeCard = ({
  preview,
  title,
  description,
  author,
}: RecipePreviewItemProps) => {
  return (
    <article className="flex w-[275px] flex-col">
      {/* IMAGE */}
      <div className="h-[290px] w-full overflow-hidden rounded-[30px]">
        <img src={preview} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* CONTENT */}
      <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <p className="text-black/70 text-sm">{description}</p>
      </div>

      {/* AUTHOR */}
      <div className="mt-4 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {author.avatar && (
            <img
              src={author.avatar}
              alt={author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
          <span className="text-sm font-medium text-black">{author.name}</span>
        </div>

        {/* RIGHT */}
        <div className="flex gap-2">
          <a
            href="#"
            className="border-black/10 flex size-[45px] items-center justify-center rounded-[30px] border"
          >
            <Icon size={18} name="heart" />
          </a>
          <a
            href="#"
            className="border-black/10 flex size-[45px] items-center justify-center rounded-[30px] border"
          >
            <Icon size={18} name="arrow-up-right" />
          </a>
        </div>
      </div>
    </article>
  );
};
