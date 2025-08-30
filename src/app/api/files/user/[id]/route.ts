import { db } from "@/db";
import { files } from "@/db/schema/file-schema";
import { eq } from "drizzle-orm";

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    const data = await db.select().from(files).where(eq(files.uploaded_by, id));

    if (data.length === 0) {
        return new Response(JSON.stringify({ error: "Files not found for this user" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    return Response.json({
        files: data,
    });
}
