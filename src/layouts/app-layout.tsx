import Footer from "@/layouts/components/footer"
import Header from "@/layouts/components/header"
import type { ReactNode } from "react"

function AppLayout({children}: {children: ReactNode}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-6 space-y-6 w-full">
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default AppLayout