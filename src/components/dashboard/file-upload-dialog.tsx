"use client"

import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { File, FileText, Image, Music, Upload, Video, X } from "lucide-react";
import { toast } from "sonner";

interface FileItem {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    uploading?: boolean;
    uploaded?: boolean;
    error?: string;
}

interface FileInfo {
    id: string
    presigned_url: string
    filename: string
    key: string
}

export default function DialogFileUpload() {
    const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([])
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const updateFileStatus = (fileId: string, updates: Partial<FileItem>) => {
        setSelectedFiles(prev => prev.map(file =>
            file.id === fileId ? { ...file, ...updates } : file
        ))
    }

    const deleteFileFromDB = async (fileId: string) => {
        try {
            const fileInfo = {
                id: fileId
            }

            const res = await fetch(`/api/files/${fileId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fileInfo)
            });
            if (!res.ok) {
                console.error("Failed to delete file from database: ", res.statusText)
            }
        } catch (err) {
            console.error("Error deleting file from database: ", err)
        }
    }

    const uploadFile = async (file: FileItem) => {
        updateFileStatus(file.id, { uploading: true, error: "" })
        const fileInfo = {
            name: file.name,
            mime_type: file.type,
            size: file.size,
        }

        try {
            const res = await fetch("/api/files", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fileInfo),
            });

            if (!res.ok) {
                const err = await res.text()
                console.error("Failed to get presigned url: ", err)
                updateFileStatus(file.id, {
                    uploading: false,
                    error: `Failed to get upload url: ${res.status} - ${res.statusText}`
                })
                return;
            }

            const data: FileInfo = await res.json();
            if (!data.presigned_url) {
                console.error("Failed to get presigned url")
                updateFileStatus(file.id, {
                    uploading: false,
                    error: `No presigned url received`
                })
                if (data.id) {
                    await deleteFileFromDB(data.id)
                }
                return;
            }

            const uploadRes = await fetch(data.presigned_url, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type
                },
                body: file.file
            })

            if (uploadRes.ok) {
                updateFileStatus(file.id, {
                    uploading: false,
                    uploaded: true
                });
            } else {
                const errmsg = await uploadRes.text();
                console.error("Failed to upload file: ", errmsg)
                updateFileStatus(file.id, {
                    uploading: false,
                    error: errmsg
                })

                if (data.id) {
                    await deleteFileFromDB(data.id)
                }
            }
        } catch (err) {
            console.error("Upload process error: ", err)
            const errmsg = `Error: ${err}`
            updateFileStatus(file.id, {
                uploading: false,
                error: errmsg
            })
        }
    }

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;
        setIsUploading(true);
        
        const uploads = selectedFiles.map((file) => uploadFile(file))
        
        try {
            await Promise.allSettled(uploads);
            
            setTimeout(() => {
                setSelectedFiles(currentFiles => {
                    const successfulFiles = currentFiles.filter(f => f.uploaded && !f.error);
                    const failedFiles = currentFiles.filter(f => !f.uploaded || f.error);
                    
                    if (failedFiles.length === 0) {
                        toast("All files uploaded successfully");
                        return [];
                    } else if (successfulFiles.length === 0) {
                        const failedFileNames = failedFiles.map(f => f.name).join(', ');
                        toast("All files failed to upload", {
                            description: `Failed files: ${failedFileNames}`
                        });
                    } else {
                        const failedFileNames = failedFiles.map(f => f.name).join(', ');
                        toast(`${successfulFiles.length} files uploaded, ${failedFiles.length} failed`, {
                            description: `Failed files: ${failedFileNames}`
                        });
                    }
                    
                    return currentFiles;
                });
            }, 100);
            
        } catch (err) {
            console.error("Upload failed: ", err)
            toast("Failed to upload files", {
                description: `Error: ${err}`
            })
        } finally {
            setIsUploading(false)
        }
    }

    const clearFiles = () => {
        setSelectedFiles([]);
    }

    return (
        <Dialog>
            <DialogTrigger className="flex text-center items-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload files</DialogTitle>
                    <DialogDescription>
                        Select or drag and drop files to upload
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <UploadFile
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        clearFiles={clearFiles}
                    />
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={clearFiles}
                        type="button"
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={selectedFiles.length === 0 || isUploading}
                        type="button"
                        className="min-w-[100px]"
                    >
                        {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface UploadFileProps {
    selectedFiles: FileItem[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
    clearFiles: () => void;
}

function UploadFile({ selectedFiles, setSelectedFiles, clearFiles }: UploadFileProps) {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const removeFile = (fileId: string) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        addFiles(files);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['b', 'kb', 'mb', 'gb'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
        if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />;
        if (fileType.startsWith('audio/')) return <Music className="w-4 h-4" />;
        if (fileType.includes('text/') || fileType.includes('document')) return <FileText className="w-4 h-4" />;
        return <File className="w-4 h-4" />;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        addFiles(files);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addFiles = (files: File[]) => {
        const newFiles: FileItem[] = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            uploading: false,
            uploaded: false
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
    };

    const truncateFileName = (fileName: string, maxLength: number = 25) => {
        if (fileName.length <= maxLength) return fileName;

        const extension = fileName.split('.').pop();
        const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));

        if (extension && nameWithoutExtension.length > maxLength - extension.length - 4) {
            return `${nameWithoutExtension.substring(0, maxLength - extension.length - 4)}...${extension}`;
        }

        return `${fileName.substring(0, maxLength - 3)}...`;
    };

    const getFileStatusIndicator = (fileItem: FileItem) => {
        if (fileItem.uploading) {
            return (
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-blue-600">Uploading...</span>
                </div>
            );
        }

        if (fileItem.uploaded) {
            return (
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Uploaded</span>
                </div>
            );
        }

        if (fileItem.error) {
            return (
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-red-600" title={fileItem.error}>Failed</span>
                </div>
            );
        }

        return (
            <span className="text-xs text-gray-500">Ready</span>
        );
    };

    return (
        <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${isDragOver
                ? 'border-blue-500 bg-blue-50 border-solid'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragOver ? 'text-blue-500' : 'text-gray-400'
                }`} />
            <p className="text-lg font-medium mb-2 text-gray-700">
                {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
                or click to browse
            </p>
            <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-black hover:bg-zinc-800"
            >
                Choose Files
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
            />

            {selectedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                            Selected Files ({selectedFiles.length})
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFiles}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Clear all
                        </Button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedFiles.map((fileItem) => (
                            <div
                                key={fileItem.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                            >
                                <div className="text-gray-500 flex-shrink-0">
                                    {getFileIcon(fileItem.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p
                                        className="text-sm font-medium text-gray-900 break-words leading-tight"
                                        title={fileItem.name}
                                    >
                                        {truncateFileName(fileItem.name)}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(fileItem.size)}
                                        </p>
                                        {getFileStatusIndicator(fileItem)}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(fileItem.id)}
                                    className="p-1 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                                    disabled={fileItem.uploading}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
