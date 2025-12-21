interface ProfileTabsProps {
  activeTab: 'recipes' | 'favorites' | 'followers' | 'following';
  onTabChange: (
    tab: 'recipes' | 'favorites' | 'followers' | 'following'
  ) => void;
  tabsOverride?: Array<
    | { id: 'recipes'; label: string }
    | { id: 'favorites'; label: string }
    | { id: 'followers'; label: string }
    | { id: 'following'; label: string }
  >;
}

export const ProfileTabs = ({
  activeTab,
  onTabChange,
  tabsOverride,
}: ProfileTabsProps) => {
  const tabs = tabsOverride ?? [
    { id: 'recipes' as const, label: 'MY RECIPES' },
    { id: 'favorites' as const, label: 'MY FAVORITES' },
    { id: 'followers' as const, label: 'FOLLOWERS' },
    { id: 'following' as const, label: 'FOLLOWING' },
  ];

  return (
    <div className="mb-6 border-b border-light-grey">
      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap pb-3 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-black text-black'
                : 'text-light-grey hover:text-dark-grey'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
