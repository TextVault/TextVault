'use client';
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Tooltip, Button, Skeleton, CircularProgress } from "@nextui-org/react";
import { isAuthenticated } from "@/actions/auth.action";
import { title } from "@/components/primitives";
import toast from 'react-hot-toast';
import { Languages } from "@/types/languages";

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

export const DeleteIcon = () => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 20 20"
            width="1em"
        >
            <path
                d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M8.60834 13.75H11.3833"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M7.91669 10.4167H12.0834"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
        </svg>
    );
};

export default function Profile() {
    const [page, setPage] = useState(1);
    const [pastes, setPastes] = useState<Paste[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const ROWS_PER_PAGE = 10;

    const paginatedItems = useMemo(() => {
        if(pastes == null) return [];

        const start = (page - 1) * ROWS_PER_PAGE;
        const end = start + ROWS_PER_PAGE;
        return pastes.slice(start, end);
    }, [page, pastes]);

    const fetchPastes = useCallback(async () => {
        try {
            const response = await fetch('/api/profile');
            const data = await response.json();

            if (data.success) {
                setPastes(data.result.pastes);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const checkAndFetchData = async () => {
            const isLoggedIn = await isAuthenticated();

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
                const response = await fetch(`/api/pastes?id=${pasteId}`, {
                    method: 'DELETE',
                });
                const data = await response.json();

                if (data.success) {
                    toast.success('Paste success deleted', {
                        position: 'bottom-right'
                    });
                    await fetchPastes();
                }
            } catch (error) {
                toast.error(`Failed to delete paste: ${(error as Error).message || JSON.stringify(error)}`, {
                    position: 'bottom-right'
                });
            }

        }, [router])

    const renderCell = useCallback((paste: Paste, columnKey: any) => {
        switch (columnKey) {
            case "name":
                return (
                    <a
                        href={`/view/${paste.ID}`}
                        className="text-bold text-sm capitalize text-primary-600 hover:text-primary-700"
                    >
                        {paste.Title}
                    </a>
                );
            case "language":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">{Languages.find(
                            lang => lang.value === paste.Language
                        )?.label || paste.Language}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative items-center gap-2">
                        <Tooltip color="danger" content="Delete paste forever">
                            <Button
                                startContent={<DeleteIcon />}
                                color="danger"
                                variant="bordered"
                                size="sm"
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
                <CircularProgress size="lg" color="primary"></CircularProgress>
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
                                <TableColumn
                                    key={column.uid}
                                    align={column.uid === "actions" ? "center" : "start"}
                                >
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
                                        {(columnKey) => (
                                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                                        )}
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
