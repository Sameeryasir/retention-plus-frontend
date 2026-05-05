import AdminPanelSidebar from "@/app/components/AdminPanelSidebar";
import RestaurantNavbar from "@/app/components/RestaurantNavbar";

export default function RestaurantDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh min-h-0 w-full bg-zinc-50">
      <AdminPanelSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <RestaurantNavbar />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
