interface ProfileTabsProps {
  activeTab: 'recipes' | 'favorites' | 'followers' | 'following';
  onTabChange: (
    tab: 'recipes' | 'favorites' | 'followers' | 'following'
  ) => void;
}

export const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  const tabs = [
    { id: 'recipes' as const, label: 'MY RECIPES' },
    { id: 'favorites' as const, label: 'MY FAVORITES' },
    { id: 'followers' as const, label: 'FOLLOWERS' },
    { id: 'following' as const, label: 'FOLLOWING' },
  ];

  return (
    <div className="mb-8 border-b border-gray-200">
      <div className="flex gap-4 overflow-x-auto md:gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap pb-3 text-xs font-semibold transition-colors md:pb-4 md:text-sm ${
              activeTab === tab.id
                ? 'border-b-2 border-black text-black'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
