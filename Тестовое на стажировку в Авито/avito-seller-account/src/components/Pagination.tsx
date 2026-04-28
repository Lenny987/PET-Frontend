import { Pagination as MantinePagination, Center } from '@mantine/core';

interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export function Pagination({ total, currentPage, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <Center mt="xl">
        <MantinePagination total={totalPages} value={currentPage} onChange={onChange} boundaries={2} siblings={1} />
    </Center>
  );
}