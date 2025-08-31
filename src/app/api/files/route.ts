import { db } from "@/db";
import { files } from "@/db/schema/file-schema";
import createNamespacedId from "@/utils/create-namespace-id";
import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const fileInsertSchema = z.object({
    name: z.string().min(3),
    mime_type: z.string().min(1),
    size: z.number().int().positive(),
})

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const validatedData = fileInsertSchema.safeParse(data);
        if (!validatedData.success) {
            console.error("Validation failed: ", validatedData.error);
            return new Response(JSON.stringify({ error: "Invalid request data", details: validatedData.error }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = session.user.id;
        console.log("Authenticated user ID:", id);

        const key = `uploads/${id}/${createNamespacedId("file")}-${validatedData.data.name}`;

        const [file] = await db.insert(files).values({
            name: validatedData.data.name,
            mime_type: validatedData.data.mime_type,
            size: validatedData.data.size,
            key,
            uploaded_by: id,
        }).returning();

        if (!file) {
            return new Response(JSON.stringify({ error: "Failed to create file record in the database" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const url = await getSignedUrl(r2, new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: file.key,
            ContentType: file.mime_type,
        }), { expiresIn: 60 * 10 });

        return Response.json({
            id: file.id,
            presigned_url: url,
            filename: file.name,
            key: file.key
        });

    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return new Response(JSON.stringify({ error: "An unexpected server error occurred" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = session.user.id;
        console.log("Authenticated user ID:", id);

        const data = await db.select().from(files).where(eq(files.uploaded_by, id));
        console.log("Found files:", data);

        if (data.length === 0) {
            return NextResponse.json(
                { message: "No files found for this user." },
                { status: 200 }
            );
        }

        return NextResponse.json({ files: data }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch user files:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
