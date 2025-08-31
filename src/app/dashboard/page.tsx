import FilesTable from "@/components/dashboard/file-table";
import DashboardNavbar from "@/components/dashboard/navbar";

export default async function page() {
    return (
        <>
            <div>
                <DashboardNavbar />
            </div>


            <div className="container mx-auto py-10">
                <div className="pl-5 font-bold text-xl">Files</div>
                <FilesTable />
            </div>
        </>
    );
}
