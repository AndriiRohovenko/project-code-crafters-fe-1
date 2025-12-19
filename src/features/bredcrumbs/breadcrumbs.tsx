import { Link } from 'react-router-dom';

type BreadcrumbsProps = {
  name: string;
};

export const Breadcrumbs = ({ name }: BreadcrumbsProps) => {
  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 2xl:px-0">
      <nav aria-label="Breadcrumb" className="mb-8 mt-10 md:mb-10 2xl:mt-14">
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
