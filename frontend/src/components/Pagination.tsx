import { Button } from '../components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  maxVisiblePages: number;
  goToPage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  maxVisiblePages = 5,
  goToPage
}) => {
  const pageNumbers = [];
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button 
        variant="outline" 
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      
      {startPage > 1 && (
        <>
          <Button variant="outline" onClick={() => goToPage(1)}>1</Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}
      
      {pageNumbers.map(number => (
        <Button
          key={number}
          variant={currentPage === number ? "default" : "outline"}
          onClick={() => goToPage(number)}
        >
          {number}
        </Button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button variant="outline" onClick={() => goToPage(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}
      
      <Button 
        variant="outline" 
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};
