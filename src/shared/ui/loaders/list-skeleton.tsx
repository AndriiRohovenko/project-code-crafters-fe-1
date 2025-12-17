import React from 'react';

type Props = {
  rows?: number;
};

export const ListSkeleton: React.FC<Props> = ({ rows = 5 }) => {
  return (
    <ul className="divide-y divide-light-grey">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-start justify-between py-5 md:py-10">
          {/* Left block: avatar + texts + follow button (always visible) */}
          <div className="flex items-start gap-4">
            {/* avatar: 60px mobile, 85px md+ */}
            <div className="skeleton-shimmer h-[60px] w-[60px] rounded-full md:h-[85px] md:w-[85px]" />

            <div>
              {/* name: 16px mobile, 20px md+ */}
              <div className="skeleton-shimmer h-[24px] w-[140px] rounded md:w-[180px]" />

              {/* Own recipes line */}
              <div className="skeleton-shimmer mt-1 h-[18px] w-[120px] rounded md:h-[20px] md:w-[150px]" />

              {/* follow/unfollow button: min-w 92 mobile, 116 md+ */}
              <div className="skeleton-shimmer mt-2 h-[37.6px] w-[92px] rounded-full md:h-[45.6px] md:w-[116px]" />
            </div>
          </div>

          {/* Previews: hidden on mobile, 3 on md+, 4th only on 2xl */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="skeleton-shimmer h-[100px] w-[100px] rounded-xl" />
            <div className="skeleton-shimmer h-[100px] w-[100px] rounded-xl" />
            <div className="skeleton-shimmer h-[100px] w-[100px] rounded-xl" />
            <div className="skeleton-shimmer hidden h-[100px] w-[100px] rounded-xl 2xl:block" />
          </div>

          {/* Arrow icon: small on mobile (w-9), medium on md+ (42px) */}
          <div className="skeleton-shimmer h-9 w-9 rounded-full md:hidden" />
          <div className="skeleton-shimmer hidden h-[42px] w-[42px] rounded-full md:inline-flex" />
        </li>
      ))}
    </ul>
  );
};
