"use client"

import { Button } from "@/components/ui/button";
import { RowSelectionState, Table } from "@tanstack/react-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface DialogFileDeleteProps<TData> {
    table: Table<TData>;
    rowSelection: RowSelectionState;
}

export function DialogFileDelete<TData>({ table, rowSelection }: DialogFileDeleteProps<TData>) {
    const isAnyRowSelected = Object.keys(rowSelection).length > 0;

    async function DeleteFiles() {
        const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
        const fileIds = selectedRows.map((row: any) => row.id);
        
        try {
            const response = await fetch('/api/files', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileIds })
            });
            
            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to delete files:', error);
        }
    };

    if (!isAnyRowSelected) {
        return null;
    }

    return (
        <Dialog>
            <DialogTrigger className="px-2 py-[5px]">
                Delete
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your selected files.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="default">NO</Button>
                    <Button variant="destructive" onClick={DeleteFiles}>YES</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
