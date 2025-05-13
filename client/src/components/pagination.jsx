import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router";

import { cn } from "../helpers/utils";
import { buttonVariants } from "../components/button";

const PaginationRoot = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
PaginationRoot.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
  <Link
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Poprzednia</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Następna</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Więcej stron</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const Pagination = ({ totalPages = 1, ...props }) => {
  const { pathname, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const generatePagination = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push(-1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push(-2);

      pages.push(totalPages);
    }

    return pages;
  };

  const getNavigationLinks = () => {
    searchParams.set("page", Math.max(currentPage - 1, 1));
    const previousLink = `${pathname}?${searchParams.toString()}`;
    searchParams.set("page", Math.min(currentPage + 1, totalPages));
    const nextLink = `${pathname}?${searchParams.toString()}`;

    return {
      previousLink,
      nextLink,
      getLink: (page) => {
        searchParams.set("page", Math.min(Math.max(page, 1), totalPages));
        return `${pathname}?${searchParams.toString()}`;
      },
    };
  };

  const { previousLink, nextLink, getLink } = getNavigationLinks();

  return (
    <PaginationRoot {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious to={previousLink} />
        </PaginationItem>
        {generatePagination().map((page) =>
          page < 0 ? (
            <PaginationItem key={page} className="hidden sm:block">
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page} className="hidden sm:block">
              <PaginationLink
                to={getLink(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext to={nextLink} />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};

export default Pagination;
