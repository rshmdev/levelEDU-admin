import { DesktopNav, MobileNav } from "@/components/tenant/sidebar";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {



  return (
    <main className="flex min-h-screen overflow-y-auto max-h-screen w-full flex-col bg-muted/40">
      <DesktopNav />
      <div className="flex flex-col flex-1 overflow-y-auto sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:hidden">
          <MobileNav />
        </header>
        <main className=" overflow-auto flex px-4 flex-1">
          {children}
        </main>
      </div>
    </main>

  );
}

