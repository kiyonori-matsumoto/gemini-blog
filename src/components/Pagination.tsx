import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g., '/posts' or '/tags/some-tag'
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex items-center -space-x-px h-10 text-base">
        <li>
          <Link
            href={`${basePath}${currentPage > 1 ? `?page=${currentPage - 1}` : ''}`}
            className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
            }`}
            aria-disabled={currentPage === 1}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </Link>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <Link
              href={`${basePath}${page > 1 ? `?page=${page}` : ''}`}
              className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white ${
                page === currentPage
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {page}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={`${basePath}${currentPage < totalPages ? `?page=${currentPage + 1}` : `?page=${totalPages}`}`}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
            }`}
            aria-disabled={currentPage === totalPages}
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
