import DashboardNavbar from "@/components/dashboard-navbar";
import FilesTable from "@/components/dashboard/file-table";

export default async function page() {

    return (
        <>
            <div>
                <DashboardNavbar />
            </div>

            <div className="container mx-auto py-10">
                <FilesTable />
            </div>
        </>
    );
}
