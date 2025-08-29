import { db } from "@/db";
import { files } from "@/db/schema/file-schema";
import { eq } from "drizzle-orm";

export async function GET(
    _request: Request,
    { params }: { params: { userid: string } }
) {
    const { userid } = params;

    const data = await db.select().from(files).where(eq(files.uploaded_by, userid));

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
