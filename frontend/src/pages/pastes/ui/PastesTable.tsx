import { Link } from "react-router-dom";
import { Link as ChakraLink, LinkBox, LinkOverlay, Table } from "@chakra-ui/react";

import { Paste, Pastes } from "@/entities/paste/model";
import { Languages } from "@/shared/types/languages.ts";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

const COLUMNS = [
  { name: "TITLE", uid: "name" },
  { name: "LANGUAGE", uid: "language" },
  { name: "ACTIONS", uid: "actions" },
];

type Props = {
  pastes: Pastes;
  handleDeletePaste: (pasteId: string) => void;
};
export const PastesTable = ({ pastes, handleDeletePaste }: Props) => {
  const renderRow = (paste: Paste) => (
    <LinkBox key={paste.id} asChild>
      <Table.Row>
        <Table.Cell>
          <ChakraLink asChild colorPalette={"blue"}>
            <LinkOverlay asChild>
              <Link to={`/view/p/${paste.id}`}>{paste.title}</Link>
            </LinkOverlay>
          </ChakraLink>
        </Table.Cell>
        <Table.Cell>
          <Tag colorPalette={"blue"} size={"lg"} variant={"solid"}>
            {Languages.find((lang) => lang.value === paste.language)?.label || paste.language}
          </Tag>
        </Table.Cell>
        <Table.Cell textAlign={"end"}>
          <Button
            _hover={{ color: "fg.error", bg: "bg.emphasized" }}
            bg={"bg.error"}
            borderColor={"fg.error"}
            color="fg.error"
            size="sm"
            variant="outline"
            onClick={() => handleDeletePaste(paste.id)}
          >
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>
    </LinkBox>
  );

  return (
    <Table.Root interactive showColumnBorder size="sm">
      <Table.Header>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.ColumnHeader
              key={column.uid}
              alignItems={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      {!pastes ? (
        <Table.Body>{[]}</Table.Body>
      ) : (
        <Table.Body>{pastes.map((item: Paste) => renderRow(item))}</Table.Body>
      )}
    </Table.Root>
  );
};
