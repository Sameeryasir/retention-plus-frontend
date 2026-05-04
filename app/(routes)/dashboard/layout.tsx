import AdminPanelSidebar from "@/app/components/AdminPanelSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh min-h-0 w-full overflow-hidden">
      <AdminPanelSidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-zinc-50">
        {children}
      </main>
    </div>
  );
}
