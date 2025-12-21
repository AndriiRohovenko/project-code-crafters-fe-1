import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { getUsersByid, User } from '@/api/api.gen';
import { ProfileFollowPanel } from '@/features/profile/ui/profile-follow-panel';
import { ProfileHeader } from '@/features/profile/ui/profile-header';
import { ProfileRecipesList } from '@/features/profile/ui/profile-recipes-list';
import { ProfileTabs } from '@/features/profile/ui/profile-tabs';
import { useAppSelector } from '@/redux/hooks';

import { Breadcrumbs } from '../features/bredcrumbs/breadcrumbs';

type TabType = 'recipes' | 'favorites' | 'followers' | 'following';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useAppSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
          setError('Invalid user ID');
          return;
        }

        const user = await getUsersByid(userId);
        setProfileUser(user);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Redirect to own profile if viewing own user page
  if (currentUser && profileUser && currentUser.id === profileUser.id) {
    return <Navigate to="/profile" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4">
        <p className="text-lg text-light-grey">Loading profile...</p>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-red-600">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:px-6 lg:px-8">
      {/* Заголовок */}
      <div className="mb-8 w-full md:w-[443px] lg:w-[443px]">
        <Breadcrumbs name={profileUser.name || 'User Profile'} />
        <h1 className="mb-5 text-3xl font-bold uppercase text-black md:text-4xl">
          {profileUser.name || 'USER PROFILE'}
        </h1>
        <p className="text-sm font-medium text-light-grey md:text-base">
          Explore {profileUser.name}'s culinary creations and favorite recipes.
        </p>
      </div>

      {/* Two column layout */}
      <div className="flex w-full flex-col gap-8 md:gap-10 lg:flex-row lg:gap-20">
        {/* Left sidebar - Profile Header */}
        <div className="w-full md:mx-auto md:w-[443px] lg:w-[443px] lg:flex-shrink-0">
          <ProfileHeader user={profileUser} isOwnProfile={false} />
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

export default UserProfile;
