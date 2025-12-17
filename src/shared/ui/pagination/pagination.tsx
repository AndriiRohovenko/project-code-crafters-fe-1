import { PageButton } from '../page-button';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const getPages = (page: number, totalPages: number) => {
  const delta = 2;
  const start = Math.max(1, page - delta);
  const end = Math.min(totalPages, page + delta);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-[6px]"
      aria-label="Pagination"
    >
      {getPages(page, totalPages).map((p) => (
        <PageButton
          key={p}
          label={p}
          isActive={p === page}
          onClick={() => onPageChange(p)}
        />
      ))}
    </nav>
  );
};
