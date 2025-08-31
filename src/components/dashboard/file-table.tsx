"use client";

import { useEffect, useState } from "react";
import { columns, DampeFile } from "./columns";
import { DataTable } from "./data-table";
import { useSession } from "@/lib/auth-client";
import { LoadingDataTable } from "./skeleton-table";

export default function FilesTable() {
    const { data: session, isPending, error } = useSession();
    const [isloading, setloading] = useState<boolean>(true);
    const [files, setFiles] = useState<DampeFile[]>([]);
    const [err, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isPending) {
            setloading(true)
        } else {
            setloading(false);
        }
    }, [isPending])

    const fetchFiles = async () => {
        setloading(true);
        try {
            const res = await fetch("/api/files");
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch files: ${res.statusText} - ${errorText}`);
            }
            const data = await res.json();
            
            setFiles(data.files || []);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchFiles();
        }
    }, [session]);

    useEffect(() => {
        if (error) {
            setError(error.message)
        }
    }, [error, err])

    if (isPending || isloading) {
        return (
            <div className="container mx-auto px-5">
                <LoadingDataTable
                    rowCount={6}
                    columnCount={5}
                    columnHeaders={['Name', 'Type', 'Size', 'Owner', 'Actions']}
                />
            </div>
        );
    }

    if (err) {
        return (
            <div className="container mx-auto px-5">
                <div className="text-red-500">Error: {err}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-5">
            <DataTable columns={columns} data={files} />
        </div>
    );
}
