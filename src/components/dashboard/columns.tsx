"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import z from "zod"

const MIME_TYPE = {
    JSON: "application/json",
    PDF: "application/pdf",
    XML: "application/xml",
    ZIP: "application/zip",
    GZIP: "application/gzip",

    PLAIN: "text/plain",
    HTML: "text/html",
    CSS: "text/css",
    CSV: "text/csv",
    MARKDOWN: "text/markdown",

    JPEG: "image/jpeg",
    PNG: "image/png",
    GIF: "image/gif",
    SVG: "image/svg+xml",
    WEBP: "image/webp",
    ICO: "image/x-icon",

    MPEG_AUDIO: "audio/mpeg",
    WAV: "audio/wav",
    OGG_AUDIO: "audio/ogg",
    WEBM_AUDIO: "audio/webm",

    MPEG_VIDEO: "video/mpeg",
    MP4: "video/mp4",
    WEBM_VIDEO: "video/webm",
    AVI: "video/x-msvideo",
} as const;

export const FileZod = z.object({
    id: z.string().min(3),
    name: z.string().min(3),
    mime_type: z.enum(Object.values(MIME_TYPE)),
    size: z.number(),
    uploaded_by: z.string(),
    owner_name: z.string(),
    owner_email: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
})

export type DampeFile = z.infer<typeof FileZod>;

export const columns: ColumnDef<DampeFile>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "mime_type",
        header: "Mime Type",
    },
    {
        accessorKey: "owner_email",
        header: "Uploaded By",
    },
    {
        accessorKey: "size",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Size
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const bytes: number = row.getValue("size");

            const formatFileSize = (b: number) => {
                if (b === 0) return "0 Bytes";

                const sizes = ["b", "kb", "mb", "gb", "tb", "pb"];
                const i = Math.floor(Math.log(b) / Math.log(1024));
                return parseFloat((b / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
            };

            const formattedSize = formatFileSize(bytes);

            return <div className="font-medium">{formattedSize}</div>;
        },
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Updated At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const file = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(file.id)}
                        >
                            Copy payment {file.id}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>File Information</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

