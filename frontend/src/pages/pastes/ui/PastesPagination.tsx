import { HStack } from "@chakra-ui/react";

import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

interface Props {
  count: number;
  page: number;
  pageSize: number;
}

export const PastesPagination = ({ count, pageSize, page }: Props) => {
  return (
    <PaginationRoot count={count} page={page} pageSize={pageSize}>
      <HStack wrap="wrap">
        <PaginationPrevTrigger />
        <PaginationItems />
        <PaginationNextTrigger />
      </HStack>
    </PaginationRoot>
  );
};
