import DashboardNavbar from "@/components/dashboard-navbar";
import { columns, File } from "@/components/dashboard/columns";
import { DataTable } from "@/components/dashboard/data-table";

async function getData(): Promise<File[]> {
    return [
        {
            "id": "728ed521",
            "name": "project-report",
            "mime_type": "application/pdf",
            "uploaded_by": "alice_smith",
            "size": 1024,
            "updated_at": "08/30/2025 17:01:33"
        },
        {
            "id": "728ed522",
            "name": "team-photo",
            "mime_type": "image/jpeg",
            "uploaded_by": "bob_jones",
            "size": 2048,
            "updated_at": "08/29/2025 11:45:00"
        },
        {
            "id": "728ed523",
            "name": "budget-spreadsheet",
            "mime_type": "application/pdf",
            "uploaded_by": "charlie_brown",
            "size": 512,
            "updated_at": "08/28/2025 09:30:15"
        },
        {
            "id": "728ed524",
            "name": "code-snippet",
            "mime_type": "text/plain",
            "uploaded_by": "diana_prince",
            "size": 250,
            "updated_at": "08/27/2025 14:22:50"
        },
        {
            "id": "728ed525",
            "name": "holiday-video",
            "mime_type": "video/mp4",
            "uploaded_by": "ethan_hunt",
            "size": 10240,
            "updated_at": "08/26/2025 10:05:10"
        },
        {
            "id": "728ed526",
            "name": "design-mockup",
            "mime_type": "image/png",
            "uploaded_by": "alice_smith",
            "size": 5120,
            "updated_at": "08/25/2025 16:55:40"
        },
        {
            "id": "728ed527",
            "name": "quarterly-report",
            "mime_type": "application/pdf",
            "uploaded_by": "bob_jones",
            "size": 100,
            "updated_at": "08/24/2025 08:00:00"
        },
        {
            "id": "728ed528",
            "name": "api-documentation",
            "mime_type": "application/json",
            "uploaded_by": "charlie_brown",
            "size": 500,
            "updated_at": "08/23/2025 12:35:25"
        },
        {
            "id": "728ed529",
            "name": "marketing-plan",
            "mime_type": "application/zip",
            "uploaded_by": "diana_prince",
            "size": 25600,
            "updated_at": "08/22/2025 15:40:00"
        },
        {
            "id": "728ed530",
            "name": "financial-records",
            "mime_type": "application/xml",
            "uploaded_by": "ethan_hunt",
            "size": 51200,
            "updated_at": "08/21/2025 09:10:20"
        },
        {
            "id": "728ed531",
            "name": "presentation-draft",
            "mime_type": "text/markdown",
            "uploaded_by": "alice_smith",
            "size": 100,
            "updated_at": "08/20/2025 11:55:00"
        },
        {
            "id": "728ed532",
            "name": "training-video",
            "mime_type": "video/webm",
            "uploaded_by": "bob_jones",
            "size": 102400,
            "updated_at": "08/19/2025 13:00:00"
        },
        {
            "id": "728ed533",
            "name": "customer-data",
            "mime_type": "text/csv",
            "uploaded_by": "charlie_brown",
            "size": 5120,
            "updated_at": "08/18/2025 14:15:30"
        },
        {
            "id": "728ed534",
            "name": "invoice",
            "mime_type": "application/pdf",
            "uploaded_by": "diana_prince",
            "size": 250,
            "updated_at": "08/17/2025 16:45:10"
        },
        {
            "id": "728ed535",
            "name": "audio-recording",
            "mime_type": "audio/wav",
            "uploaded_by": "ethan_hunt",
            "size": 5120,
            "updated_at": "08/16/2025 18:30:50"
        },
        {
            "id": "728ed536",
            "name": "sales-report",
            "mime_type": "application/pdf",
            "uploaded_by": "alice_smith",
            "size": 2048,
            "updated_at": "08/15/2025 10:20:05"
        },
        {
            "id": "728ed537",
            "name": "vector-logo",
            "mime_type": "image/svg+xml",
            "uploaded_by": "bob_jones",
            "size": 100,
            "updated_at": "08/14/2025 11:11:11"
        },
        {
            "id": "728ed538",
            "name": "video-call",
            "mime_type": "video/x-msvideo",
            "uploaded_by": "charlie_brown",
            "size": 25600,
            "updated_at": "08/13/2025 12:22:22"
        },
        {
            "id": "728ed539",
            "name": "archive-backup",
            "mime_type": "application/gzip",
            "uploaded_by": "diana_prince",
            "size": 102400,
            "updated_at": "08/12/2025 13:33:33"
        },
        {
            "id": "728ed540",
            "name": "client-agreement",
            "mime_type": "application/pdf",
            "uploaded_by": "ethan_hunt",
            "size": 500,
            "updated_at": "08/11/2025 14:44:44"
        },
        {
            "id": "728ed541",
            "name": "web-page",
            "mime_type": "text/html",
            "uploaded_by": "alice_smith",
            "size": 100,
            "updated_at": "08/10/2025 15:55:55"
        },
        {
            "id": "728ed542",
            "name": "style-sheet",
            "mime_type": "text/css",
            "uploaded_by": "bob_jones",
            "size": 250,
            "updated_at": "08/09/2025 16:06:06"
        },
        {
            "id": "728ed543",
            "name": "presentation",
            "mime_type": "application/pdf",
            "uploaded_by": "charlie_brown",
            "size": 2048,
            "updated_at": "08/08/2025 17:17:17"
        },
        {
            "id": "728ed544",
            "name": "spread-sheet",
            "mime_type": "application/pdf",
            "uploaded_by": "diana_prince",
            "size": 5120,
            "updated_at": "08/07/2025 18:28:28"
        },
        {
            "id": "728ed545",
            "name": "website-logo",
            "mime_type": "image/webp",
            "uploaded_by": "ethan_hunt",
            "size": 100,
            "updated_at": "08/06/2025 19:39:39"
        },
        {
            "id": "728ed546",
            "name": "voice-memo",
            "mime_type": "audio/ogg",
            "uploaded_by": "alice_smith",
            "size": 500,
            "updated_at": "08/05/2025 20:40:40"
        },
        {
            "id": "728ed547",
            "name": "team-meeting",
            "mime_type": "video/mpeg",
            "uploaded_by": "bob_jones",
            "size": 25600,
            "updated_at": "08/04/2025 21:51:51"
        },
        {
            "id": "728ed548",
            "name": "blog-draft",
            "mime_type": "text/markdown",
            "uploaded_by": "charlie_brown",
            "size": 100,
            "updated_at": "08/03/2025 22:02:02"
        },
        {
            "id": "728ed549",
            "name": "image-of-plant",
            "mime_type": "image/jpeg",
            "uploaded_by": "diana_prince",
            "size": 5120,
            "updated_at": "08/02/2025 23:13:13"
        },
        {
            "id": "728ed550",
            "name": "spreadsheet-draft",
            "mime_type": "application/pdf",
            "uploaded_by": "ethan_hunt",
            "size": 2048,
            "updated_at": "08/01/2025 00:24:24"
        }
    ]
}

export default async function page() {
    const data = await getData()
    return (
        <>
            <div>
                <DashboardNavbar />
            </div>

            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    );
}
