import { useState, useEffect } from 'react';
import { DampeFile, FileZod } from '@/components/dashboard/columns';
import { z } from 'zod';

interface UseFilesReturn {
    files: DampeFile[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useFiles = (): UseFilesReturn => {
    const [files, setFiles] = useState<DampeFile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/files')
            if (!response.ok) {
                throw new Error("Failed to fetch files");
            }
            const data = await response.json();
            const parsedData = z.array(FileZod).safeParse(data);
            if (!parsedData.success) {
                console.error("Data validation failed:", parsedData.error);
                throw new Error("Invalid data received from the server.");
            }
            setFiles(parsedData.data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchFiles();
    }, []);

    return { files, isLoading, error, refetch: fetchFiles };
}
