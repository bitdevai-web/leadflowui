import { ReactNode } from "react";

interface BreadcrumbProps {
  pageTitle: string;
  pageDetails?: string;
  component?: ReactNode;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  pageDetails,
  component,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white/90">
          {pageTitle}
        </h2>
        {pageDetails && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{pageDetails}</p>
        )}
      </div>
      <nav className="flex flex-row items-center gap-2">{component}</nav>
    </div>
  );
};

export default PageBreadcrumb;
