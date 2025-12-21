import { Link } from 'react-router-dom';

type BreadcrumbsProps = {
  name: string;
};

export const Breadcrumbs = ({ name }: BreadcrumbsProps) => {
  return (
    <div className="mx-auto max-w-[1280px] px-0">
      <nav aria-label="Breadcrumb" className="mb-8 mt-0 md:mb-10">
        <ol className="flex items-center text-[12px] font-bold uppercase">
          <li>
            <Link
              to="/"
              className="text-light-grey outline-none transition-colors hover:text-black focus-visible:text-black"
            >
              Home
            </Link>
          </li>

          <li aria-hidden="true" className="mx-2 text-light-grey">
            /
          </li>

          <li aria-current="page" className="text-black">
            {name}
          </li>
        </ol>
      </nav>
    </div>
  );
};
