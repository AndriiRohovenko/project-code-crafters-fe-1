import type { FollowerUserDTO, FollowUserDTO } from '@/api/api.gen.ts';
import { ListSkeleton } from '@/shared/ui/loaders/list-skeleton';
import { EmptyState } from '@/shared/ui/states/empty-state';

import { UserFollowRow } from './user-follow-row';

type FollowListUser = FollowUserDTO | FollowerUserDTO;

const isFollowerUser = (u: FollowListUser): u is FollowerUserDTO =>
  'isFollowing' in u;

type Props = {
  tab: 'followers' | 'following';
  users: FollowListUser[];
  isLoading: boolean;
  error: string | null;
  actionLoadingIds: Record<number, boolean>;
  onFollow: (id: number) => void;
  onUnfollow: (id: number) => void;
  rows?: number;
};

export const ProfileFollowList = ({
  tab,
  users,
  isLoading,
  error,
  actionLoadingIds,
  onFollow,
  onUnfollow,
  rows,
}: Props) => {
  if (error) return <div className="py-8 text-sm text-red-600">{error}</div>;

  if (isLoading) return <ListSkeleton rows={rows ?? 5} />;

  if (!users.length) {
    const text =
      tab === 'followers'
        ? 'There are currently no followers on your account. Please engage our visitors with interesting content and draw their attention to your profile.'
        : 'Your account currently has no subscriptions to other users. Learn more about our users and select those whose content interests you.';

    return <EmptyState text={text} />;
  }

  return (
    <ul>
      {users.map((u, index) => {
        const id = u.id ?? 0;
        const isLast = index === users.length - 1;

        const isFollowing =
          tab === 'following'
            ? true
            : isFollowerUser(u)
              ? u.isFollowing
              : false;

        return (
          <li
            key={id || `${u.email}-${u.name}`}
            className={[
              'flex items-start justify-between py-5 md:py-10',
              !isLast ? 'border-b border-light-grey' : '',
            ].join(' ')}
          >
            <UserFollowRow
              user={u}
              mode={tab}
              isFollowing={isFollowing}
              isActionLoading={Boolean(id && actionLoadingIds[id])}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
            />
          </li>
        );
      })}
    </ul>
  );
};
