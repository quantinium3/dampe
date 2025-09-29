"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import FileAnalysis from "@/components/FileAnalysis"
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

// Analysis dialog state will be managed in the component
let analysisDialog: {
    open: boolean;
    fileId: string | null;
    setOpen: (open: boolean) => void;
    setFileId: (id: string | null) => void;
} | null = null;

const handleAnalyze = (fileId: string) => {
    if (analysisDialog) {
        analysisDialog.setFileId(fileId);
        analysisDialog.setOpen(true);
    }
};

// Delete dialog state will be managed in the component
let deleteDialog: {
    open: boolean;
    fileId: string | null;
    setOpen: (open: boolean) => void;
    setFileId: (id: string | null) => void;
} | null = null;

const handleDelete = (fileId: string) => {
    if (deleteDialog) {
        deleteDialog.setFileId(fileId);
        deleteDialog.setOpen(true);
    }
};

export function DeleteDialog() {
    const [open, setOpen] = useState(false);
    const [fileId, setFileId] = useState<string | null>(null);
    
    // Set the global reference
    deleteDialog = { open, fileId, setOpen, setFileId };
    
    const handleConfirmDelete = async () => {
        if (!fileId) return;
        
        try {
            const response = await fetch(`/api/files/${fileId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setOpen(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    This action cannot be undone. This will permanently delete the file.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function AnalysisDialog() {
    const [open, setOpen] = useState(false);
    const [fileId, setFileId] = useState<string | null>(null);
    
    // Set the global reference
    analysisDialog = { open, fileId, setOpen, setFileId };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">🤖 AI Document Analysis</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {fileId && <FileAnalysis fileId={fileId} />}
                </div>
            </DialogContent>
        </Dialog>
    );
}

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
                        <DropdownMenuItem onClick={() => handleAnalyze(file.id)}>AI-Analyze</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>File Information</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(file.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

