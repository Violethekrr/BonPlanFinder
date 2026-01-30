import React from "react";
import { motion } from "framer-motion";

type PaginationProps = {
  totalItems: number;          
  itemsPerPage: number;        
  currentPage: number;        
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null; 

  return (
    <div className="flex justify-center items-center gap-2 my-4">
      {/* Flèche Précédent */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-full bg-gray-200 text-[#34495E] disabled:opacity-50"
      >
        ←
      </button>

      {/* Numéros de pages */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
          (page) =>
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
        )
        .map((page, idx, arr) => (
          <React.Fragment key={page}>
            {idx > 0 && arr[idx - 1] !== page - 1 && (
              <span className="px-2">...</span>
            )}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-full transition-colors duration-300 ease-in-out ${
                    currentPage === page
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-[#34495E]'"
                }`}
            >
              {page}
            </motion.button>
          </React.Fragment>
        ))}

      {/* Flèche Suivant */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-full bg-gray-100 text-[#34495E]' disabled:opacity-50"
      >
         →
      </button>
    </div>
  );
};

export default Pagination;
