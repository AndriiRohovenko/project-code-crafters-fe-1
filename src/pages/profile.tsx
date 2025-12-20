import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { ProfileFollowPanel } from '@/features/profile/ui/profile-follow-panel';
import { ProfileHeader } from '@/features/profile/ui/profile-header';
import { ProfileRecipesList } from '@/features/profile/ui/profile-recipes-list';
import { ProfileTabs } from '@/features/profile/ui/profile-tabs';
import { useAppSelector } from '@/redux/hooks';

type TabType = 'recipes' | 'favorites' | 'followers' | 'following';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  const user = useAppSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-10 md:px-6 lg:px-8">
      {/* Заголовок */}
      <div className="mb-8 w-full md:w-[443px] lg:w-[443px]">
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
          <ProfileHeader user={user} />
        </div>

        {/* Right side - Tabs and Content */}
        <div className="w-full flex-1">
          {/* Вкладки */}
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Контент вкладок */}
          {activeTab === 'recipes' && <ProfileRecipesList tab="recipes" />}
          {activeTab === 'favorites' && <ProfileRecipesList tab="favorites" />}
          {(activeTab === 'followers' || activeTab === 'following') && (
            <ProfileFollowPanel tab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
