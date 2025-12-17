import { Link } from 'react-router-dom';

import type { FollowerUserDTO, FollowUserDTO } from '@/api/api.gen.ts';
import { Button } from '@/shared/ui/button';
import { IconButton } from '@/shared/ui/icon-button';

type FollowListUser = FollowUserDTO | FollowerUserDTO;

type Props = {
  user: FollowListUser;
  isFollowing: boolean;
  mode: 'followers' | 'following';
  isActionLoading: boolean;
  onFollow: (id: number) => void;
  onUnfollow: (id: number) => void;
};

export const UserFollowRow = ({
  user,
  isFollowing,
  mode,
  isActionLoading,
  onFollow,
  onUnfollow,
}: Props) => {
  const id = user.id ?? 0;
  const name = user.name ?? 'Unknown';
  const avatar = user.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=200';

  const buttonText =
    mode === 'following' ? 'UNFOLLOW' : isFollowing ? 'UNFOLLOW' : 'FOLLOW';

  const handleClick = () => {
    if (!id) return;

    if (mode === 'following') {
      onUnfollow(id);
      return;
    }

    if (isFollowing) onUnfollow(id);
    else onFollow(id);
  };

  const recipes = (user.recipesPreview ?? []).slice(0, 4);
  const recipesCount = user.recipesCount ?? 0;

  return (
    <>
      <div className="flex items-start gap-4">
        <img
          src={avatar}
          alt={name}
          onError={(e) => {
            e.currentTarget.src = 'https://www.gravatar.com/avatar/?d=mp&s=200';
          }}
          className="h-[60px] w-[60px] rounded-full object-cover md:h-[85px] md:w-[85px]"
        />

        <div>
          <div className="text-[16px] font-extrabold leading-[24px] tracking-[-0.02em] text-black md:text-[20px] md:leading-[24px]">
            {name.toUpperCase()}
          </div>

          <div className="mt-1 text-[12px] leading-[18px] text-light-grey md:text-[14px] md:leading-[20px]">
            Own recipes: <span className="font-semibold">{recipesCount}</span>
          </div>

          <Button
            type="button"
            variant="outline-grey"
            label={isActionLoading ? '...' : buttonText}
            disabled={isActionLoading || !id}
            onClick={handleClick}
            className="mt-2 min-w-[92px] !py-2 px-4 text-[14px] leading-[20px] md:min-w-[116px] md:py-[10px] md:text-[16px] md:leading-[24px]"
          />
        </div>
      </div>

      {/* md: 3 прев’ю, 2xl: 4 прев’ю */}
      <div className="hidden items-center gap-3 md:flex">
        {Array.from({ length: 4 }).map((_, idx) => {
          const isFourth = idx === 3;
          const responsiveClass = isFourth ? 'hidden 2xl:block' : 'block';

          const r = recipes[idx];
          const recipeId = r?.id ?? 0;
          const img = r?.image ?? null;

          if (!recipeId || !img) {
            return (
              <div
                key={`placeholder-${idx}`}
                className={`${responsiveClass} h-[100px] w-[100px] rounded-xl bg-neutral-100`}
              />
            );
          }

          return (
            <Link
              key={recipeId}
              to={`/recipes/${recipeId}`}
              className={`${responsiveClass} block h-[100px] w-[100px] overflow-hidden rounded-xl bg-neutral-100`}
              aria-label="Open recipe"
            >
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </Link>
          );
        })}
      </div>

      {/* Mobile */}
      <IconButton
        type="link"
        href={`/users/${id}`}
        iconName="arrow-up-right"
        size="small"
        className="md:hidden"
        iconColor="var(--color-black)"
        borderColor="var(--color-light-grey)"
        backgroundColor="var(--color-white)"
        aria-label={`Open ${name} page`}
      />

      {/* Tablet+ */}
      <IconButton
        type="link"
        href={`/users/${id}`}
        iconName="arrow-up-right"
        size="medium"
        className="hidden md:inline-flex"
        iconColor="var(--color-black)"
        borderColor="var(--color-light-grey)"
        backgroundColor="var(--color-white)"
        aria-label={`Open ${name} page`}
      />
    </>
  );
};
