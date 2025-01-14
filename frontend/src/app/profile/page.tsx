"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { DeleteIcon } from "@nextui-org/shared-icons";

import { title } from "@/src/components/primitives";
import { Languages } from "@/src/types/languages";
import { deletePaste } from "@/src/shared/requests/paste.action";
import { fetchUserPastes } from "@/src/shared/requests/account.action";
import { useSession } from "next-auth/react";

interface Paste {
  ID: string;
  Title: string;
  Language: string;
  AuthorID: number;
}

const COLUMNS = [
  { name: "TITLE", uid: "name" },
  { name: "LANGUAGE", uid: "language" },
  { name: "ACTIONS", uid: "actions" },
];

export default async function Profile() {
  const [page, setPage] = useState(1);
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
  });

  const ROWS_PER_PAGE = 10;

  const paginatedItems = useMemo(() => {
    if (pastes == null) return [];

    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return pastes.slice(start, end);
  }, [page, pastes]);

  const fetchPastes = useCallback(async () => {
    try {
      const { data } = await fetchUserPastes(10, 0, session?.accessToken);

      setPastes(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAndFetchData = () => {
      const isLoggedIn = localStorage.getItem("token") !== null;

      if (!isLoggedIn) {
        router.replace("/login");

        return;
      }

      fetchPastes();
    };

    checkAndFetchData();
  }, [router, fetchPastes]);

  const handleDeletePaste = useCallback(
    async (pasteId: string) => {
      try {
        await deletePaste(pasteId, localStorage.getItem("token") as string);
        toast.success("Paste success deleted");
        await fetchPastes();
      } catch (error) {
        toast.error(`Failed to delete paste: ${(error as Error).message || JSON.stringify(error)}`);
      }
    },
    [router]
  );

  const renderCell = useCallback((paste: Paste, columnKey: any) => {
    switch (columnKey) {
      case "name":
        return (
          <a
            className="text-bold text-sm capitalize text-primary-600 hover:text-primary-700"
            href={`/view/${paste.ID}`}
          >
            {paste.Title}
          </a>
        );
      case "language":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
              {Languages.find((lang) => lang.value === paste.Language)?.label || paste.Language}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="relative items-center gap-2">
            <Tooltip color="danger" content="Delete paste forever">
              <Button
                color="danger"
                size="sm"
                startContent={<DeleteIcon />}
                variant="bordered"
                onClick={() => handleDeletePaste(paste.ID)}
              >
                Delete
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  }, []);

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4">
        <CircularProgress color="primary" size="lg" />
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Your pastes</span>
      </div>
      <main className="container mx-auto px-4">
        <div className="light:bg-default-100 dark:bg-[#141414] rounded-lg shadow-lg p-6">
          <Table
            aria-label="User pastes"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pastes == null ? 1 : Math.ceil(pastes.length / ROWS_PER_PAGE)}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            classNames={{ wrapper: "min-h-[222px]" }}
          >
            <TableHeader columns={COLUMNS}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {paginatedItems.length === 0 ? (
              <TableBody emptyContent={"You don't have any pastes."}>{[]}</TableBody>
            ) : (
              <TableBody items={paginatedItems}>
                {(item) => (
                  <TableRow key={item.ID}>
                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
      </main>
    </section>
  );
}
