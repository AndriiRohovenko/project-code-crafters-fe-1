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

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  const currentUser = useAppSelector((state) => state.user);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !id;
  const user = isOwnProfile ? currentUser : profileUser;

  // Fetch user data if viewing another user's profile
  useEffect(() => {
    if (!id) {
      // Viewing own profile, no need to fetch
      setProfileUser(null);
      return;
    }

    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
          setError('Invalid user ID');
          return;
        }

        // Redirect to own profile if viewing own ID
        if (currentUser && currentUser.id === userId) {
          window.location.href = '/profile';
          return;
        }

        const fetchedUser = await getUsersByid(userId);
        setProfileUser(fetchedUser);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, currentUser]);

  // Redirect if not logged in and viewing own profile
  if (isOwnProfile && !currentUser) {
    return <Navigate to="/" replace />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4">
        <p className="text-lg text-light-grey">Loading profile...</p>
      </div>
    );
  }

  // Error state
  if (error || (!isOwnProfile && !profileUser)) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-red-600">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  // No user to display
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-10 md:px-6 lg:px-8">
      {/* Заголовок */}
      <div className="mb-8 w-full md:w-[443px] lg:w-[443px]">
        <Breadcrumbs name={isOwnProfile ? 'Profile' : user.name || 'User Profile'} />
        <h1 className="mb-5 text-3xl font-bold uppercase text-black md:text-4xl">
          {isOwnProfile ? 'PROFILE' : (user.name || 'USER PROFILE').toUpperCase()}
        </h1>
        <p className="text-sm font-medium text-light-grey md:text-base">
          {isOwnProfile
            ? 'Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us.'
            : `Explore ${user.name}'s culinary creations and favorite recipes.`}
        </p>
      </div>

      {/* Two column layout */}
      <div className="flex w-full flex-col gap-8 md:gap-10 lg:flex-row lg:gap-20">
        {/* Left sidebar - Profile Header */}
        <div className="w-full md:mx-auto md:w-[443px] lg:w-[443px] lg:flex-shrink-0">
          <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
        </div>

        {/* Right side - Tabs and Content */}
        <div className="w-full flex-1">
          {/* Вкладки */}
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Контент вкладок */}
          {activeTab === 'recipes' && (
            <ProfileRecipesList tab="recipes" userId={user.id} isOwnProfile={isOwnProfile} />
          )}
          {activeTab === 'favorites' && <ProfileRecipesList tab="favorites" />}
          {(activeTab === 'followers' || activeTab === 'following') && (
            <ProfileFollowPanel tab={activeTab} profileUserId={isOwnProfile ? undefined : user.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
