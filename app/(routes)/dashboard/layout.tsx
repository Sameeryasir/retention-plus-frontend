import AdminPanelSidebar from "@/app/components/AdminPanelSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full">
      <AdminPanelSidebar />
      <main className="min-h-screen min-w-0 flex-1 bg-zinc-50">{children}</main>
    </div>
  );
}
