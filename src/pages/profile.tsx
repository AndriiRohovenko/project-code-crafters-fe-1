import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { getUsersByid } from '@/api/api.gen';
import { Breadcrumbs } from '@/features/bredcrumbs/breadcrumbs';
import { ProfileFollowPanel } from '@/features/profile/ui/profile-follow-panel';
import { ProfileHeader } from '@/features/profile/ui/profile-header';
import { ProfileRecipesList } from '@/features/profile/ui/profile-recipes-list';
import { ProfileTabs } from '@/features/profile/ui/profile-tabs';
import { ProfileUserHeader } from '@/features/profile/ui/profile-user-header';
import { useAppSelector } from '@/redux/hooks';

type TabType = 'recipes' | 'favorites' | 'followers' | 'following';

const Profile = () => {
  const params = useParams<{ id?: string }>();
  const { id: routeId } = params;
  const user = useAppSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  const [viewUser, setViewUser] = useState(user);

  const isForeign = useMemo(() => {
    const idNum = routeId ? Number(routeId) : undefined;
    if (!idNum || !user?.id) return false;
    return idNum !== user.id;
  }, [routeId, user?.id]);

  useEffect(() => {
    if (!routeId) {
      return;
    }

    const idNum = Number(routeId);
    if (!idNum || (user && idNum === user.id)) {
      return;
    }

    // Fetch user by id for foreign profile
    getUsersByid(idNum)
      .then((u) => setViewUser(u))
      .catch(() => setViewUser(null));
  }, [routeId, user?.id, user]);

  // Only redirect if viewing own profile without authentication
  if (!routeId && !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-10 md:px-6 lg:px-8">
      {/* Заголовок */}
      <div className="mb-8 w-full md:w-[443px] lg:w-[443px]">
        <Breadcrumbs name={'Profile'} />
        <h1 className="mb-5 text-3xl font-bold uppercase text-black md:text-4xl">
          PROFILE
        </h1>
        <p className="text-sm font-medium text-light-grey md:text-base">
          Reveal your culinary art, share your favorite recipe and create
          gastronomic masterpieces with us.
        </p>
      </div>

      {/* Two column layout */}
      <div className="flex w-full flex-col gap-8 md:gap-10 lg:flex-row lg:gap-20">
        {/* Left sidebar - Profile Header */}
        <div className="w-full md:mx-auto md:w-[443px] lg:w-[443px] lg:flex-shrink-0">
          {isForeign && viewUser ? (
            <ProfileUserHeader user={viewUser} />
          ) : (
            user && <ProfileHeader user={user} />
          )}
        </div>

        {/* Right side - Tabs and Content */}
        <div className="w-full flex-1">
          {/* Вкладки */}
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabsOverride={
              isForeign
                ? [
                    { id: 'recipes', label: 'RECIPES' },
                    { id: 'followers', label: 'FOLLOWERS' },
                  ]
                : undefined
            }
          />

          {/* Контент вкладок */}
          {!isForeign && activeTab === 'recipes' && (
            <ProfileRecipesList tab="recipes" />
          )}
          {!isForeign && activeTab === 'favorites' && (
            <ProfileRecipesList tab="favorites" />
          )}
          {isForeign && activeTab === 'recipes' && (
            <div className="rounded-[15px] border border-light-grey bg-white p-6 text-center text-sm text-light-grey">
              Feature will come soon.
            </div>
          )}
          {activeTab === 'followers' && (
            <ProfileFollowPanel
              tab="followers"
              profileUserId={isForeign ? viewUser?.id : user?.id}
            />
          )}
          {!isForeign && activeTab === 'following' && (
            <ProfileFollowPanel tab="following" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
