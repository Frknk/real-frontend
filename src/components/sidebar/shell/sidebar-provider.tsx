'use client';
import { PropsWithChildren, useEffect, useState } from "react"
import { createContext, useContext } from "react"
import { usePathname } from "next/navigation"

type SidebarContextValue = {
  desktop: boolean
  mobile: boolean
  toggle: (view: "desktop" | "mobile") => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export const SidebarProvider = ({ children }: PropsWithChildren) => {
  const [desktop, setDesktop] = useState(true)
  const [mobile, setMobile] = useState(false)

  const pathname  = usePathname()

  const toggle = (view: "desktop" | "mobile") => {
    if (view === "desktop") {
      setDesktop(!desktop)
    } else {
      setMobile(!mobile)
    }
  }

  // close the mobile sidebar on route change
  // this is to prevent the sidebar from staying open
  // when navigating to a new page
  useEffect(() => {
    setMobile(false)
  }, [pathname])

  return (
    <SidebarContext.Provider value={{ desktop, mobile, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
    const context = useContext(SidebarContext)
  
    if (!context) {
      throw new Error("useSidebar must be used within a SidebarProvider")
    }
  
    return context
  }