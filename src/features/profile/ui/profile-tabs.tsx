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
    <div className="mb-6 border-b border-gray-200">
      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap pb-3 text-sm font-semibold transition-colors ${
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
