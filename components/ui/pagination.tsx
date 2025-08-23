import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center px-2 sm:px-4", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(
        "flex flex-row items-center gap-0.5 sm:gap-1 md:gap-2",
        "overflow-x-auto scrollbar-hide",
        "min-w-0 max-w-full",
        className
      )}
      {...props}
    />
  )
}

function PaginationItem({ 
  className,
  ...props 
}: React.ComponentProps<"li">) {
  return (
    <li 
      data-slot="pagination-item" 
      className={cn("flex-shrink-0", className)}
      {...props} 
    />
  )
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        // Enhanced responsive sizing
        "h-8 w-8 text-xs sm:h-9 sm:w-9 sm:text-sm",
        "min-w-[2rem] sm:min-w-[2.25rem]",
        "touch-manipulation", // Better touch targets on mobile
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn(
        "gap-1 px-2 sm:px-2.5 md:pl-2.5",
        "h-8 w-auto min-w-[2rem] sm:h-9 sm:min-w-[4rem] md:min-w-[5rem]",
        "text-xs sm:text-sm",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="hidden sm:block md:inline">Previous</span>
      <span className="sr-only sm:hidden">Previous page</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn(
        "gap-1 px-2 sm:px-2.5 md:pr-2.5",
        "h-8 w-auto min-w-[2rem] sm:h-9 sm:min-w-[4rem] md:min-w-[5rem]",
        "text-xs sm:text-sm",
        className
      )}
      {...props}
    >
      <span className="hidden sm:block md:inline">Next</span>
      <span className="sr-only sm:hidden">Next page</span>
      <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex items-center justify-center",
        "h-8 w-8 sm:h-9 sm:w-9", // Consistent sizing with other elements
        "min-w-[2rem] sm:min-w-[2.25rem]",
        "text-xs sm:text-sm",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

// Additional utility component for compact mobile pagination
function PaginationCompact({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
  className?: string
} & React.ComponentProps<"nav">) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1)
    }
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex w-full justify-between items-center px-4 py-2", className)}
      {...props}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 text-xs sm:text-sm"
      >
        <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">Previous</span>
      </Button>
      
      <span className="text-xs sm:text-sm font-medium px-2">
        Page {currentPage} of {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 text-xs sm:text-sm"
      >
        <span className="hidden xs:inline">Next</span>
        <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </nav>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationCompact,
}