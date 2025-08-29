import { db } from "@/db";
import { files, upload_state_enum } from "@/db/schema/file-schema";
import { r2 } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq } from "drizzle-orm";
import z from "zod";

const uploadStateEnumSchema = z.enum(upload_state_enum.enumValues);

const updateStateSchema = z.object({
    upload_state: uploadStateEnumSchema,
});

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const data = await request.json();

    const validatedData = updateStateSchema.safeParse(data);

    if (!validatedData.success) {
        return new Response(JSON.stringify({ error: "Invalid request data" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const [updated] = await db.update(files)
        .set({
            upload_state: validatedData.data.upload_state,
            updated_at: new Date(),
        })
        .where(eq(files.id, id))
        .returning();

    if (!updated) {
        return new Response(JSON.stringify({ error: "File not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    return Response.json({
        file: updated,
    });
}

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    // TODO: authenticate user before doing anything

    try {
        const [file] = await db.select().from(files).where(eq(files.id, id));

        if (!file) {
            return new Response(JSON.stringify({ error: "File not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        // TODO: check if the file is owned by current user
        const deletionUrl = await getSignedUrl(r2, new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: file.key,
        }), { expiresIn: 60 * 10 });

        return Response.json({
            message: "Successfully generated deletion URL.",
            deletionUrl: deletionUrl,
        });

    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return new Response(JSON.stringify({ error: "An unexpected server error occurred" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
