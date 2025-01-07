'use client';
import { useState, useMemo, JSX, SVGProps, useCallback } from "react";
import { title } from "@/components/primitives";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Tooltip,
} from "@nextui-org/react";

export const columns = [
    { name: "TITLE", uid: "name" },
    { name: "LANGUAGE", uid: "language" },
    { name: "ACTIONS", uid: "actions" },
];

export const users = [
    {
        id: 1,
        name: "Tony Reichert",
        language: "C++",
    },
    {
        id: 2,
        name: "Zoey Lang",
        language: "C++",
    },
    {
        id: 3,
        name: "Jane Fisher",
        language: "C++",
    },
    {
        id: 4,
        name: "William Howard",
        language: "C++",
    },
    {
        id: 5,
        name: "Kristen Copper",
        language: "Rust"
    },
    {
        id: 6,
        name: "Kristen Copper",
        language: "Rust"
    },
    {
        id: 7,
        name: "Kristen Copper",
        language: "Rust"
    },
    {
        id: 8,
        name: "Kristen Copper",
        language: "Rust"
    },
    {
        id: 9,
        name: "Kristen Copper",
        language: "Rust"
    },
    {
        id: 10,
        name: "Kristen Copper",
        language: "Rust"
    },
    {
        id: 11,
        name: "Kristen Copper",
        language: "Rust"
    },
    {
        id: 12,
        name: "Kristen Copper",
        language: "Rust"
    }
];

export const DeleteIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 20 20"
            width="1em"
            {...props}
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
    const rowsPerPage = 10;

    const pages = Math.ceil(users.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return users.slice(start, end);
    }, [page, users]);

    const renderCell = useCallback((user: any, columnKey: any) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <a className="text-bold text-sm capitalize text-primary-600 hovered:text-primary-700" href={`/view/a45a7127-4471-4261-9989-f21e53828b36`}>
                        {user.name}
                    </a>
                );
            case "language":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <section className="flex flex-col items-center justify-center gap-4">
            <div className="inline-block max-w-xl text-center justify-center">
                <span className={title()}>Your pastes &nbsp;</span>
            </div>
            <main className="container mx-auto px-4">
                <div className="light:bg-default-100 dark:bg-[#141414] rounded-lg shadow-lg p-6">
                    <Table
                        aria-label="Example table with client side pagination"
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        }
                        classNames={{
                            wrapper: "min-h-[222px]",
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={items}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </section>
    );
}