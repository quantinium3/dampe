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

    function DeleteFiles() {
        const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
        console.log(selectedRows);
    };

    if (!isAnyRowSelected) {
        return null;
    }

    return (
        <Dialog>
            <DialogTrigger>
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
