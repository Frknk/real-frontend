"use client"
import * as Dialog from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"
import { Avatar, DropdownMenu, Text, clx, IconButton } from "@medusajs/ui"

import {
  BuildingStorefront,
  Buildings,
  ChevronDownMini,
  CogSixTooth,
  CurrencyDollar,
  EllipsisHorizontal,
  MagnifyingGlass,
  MinusMini,
  OpenRectArrowOut,
  ReceiptPercent,
  ShoppingCart,
  SquaresPlus,
  Tag,
  Users,
} from "@medusajs/icons"

import { SidebarLeft, TriangleRightMini, XMark } from "@medusajs/icons"
import { PropsWithChildren, ReactNode } from "react"
import { useSidebar } from "./sidebar-provider"
import { Skeleton
 } from "@/components/skeleton"
 import { Divider } from "@/components/divider"
// import { Notifications } from "../notifications"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { NavItem, INavItem } from "../nav-item"

export const Shell = ({ children }: PropsWithChildren) => {

  return (
      <div className="flex h-screen flex-col items-start overflow-hidden lg:flex-row">
        <div>
          <MobileSidebarContainer><MainSidebar /></MobileSidebarContainer>
          <DesktopSidebarContainer><MainSidebar /></DesktopSidebarContainer>
        </div>
        <div className="flex h-screen w-full flex-col overflow-auto">
          <Topbar />
          <main className="flex h-full w-full flex-col items-center overflow-y-auto">
            <Gutter>
              {children}
            </Gutter>
          </main>
        </div>
      </div>
  )
}

const MainSidebar = () => {
  return (
    <aside className="flex flex-1 flex-col justify-between overflow-y-auto">
      <div className="flex flex-1 flex-col">
        <div className="bg-ui-bg-subtle sticky top-0">
          <Header />
          <div className="px-3">
            <Divider variant="dashed" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-1 flex-col">
            <CoreRouteSection />
          </div>
          {/*<UtilitySection />*/}
        </div>
        {/*<div className="bg-ui-bg-subtle sticky bottom-0">
          <UserSection />
        </div>*/}
      </div>
    </aside>
  )
}

const UtilitySection = () => {

  return (
    <div className="flex flex-col gap-y-0.5 py-3">
      <NavItem
        label="Settings"
        to="/settings"
        from={location.pathname}
        icon={<CogSixTooth />}
      />
    </div>
  )
}

const UserSection = () => {
  return (
    <div>
      <div className="px-3">
        <Divider variant="dashed" />
      </div>
      {"<UserMenu />"}
    </div>
  )
}

const useCoreRoutes = (): Omit<INavItem, "pathname">[] => {

  return [
    {
      icon: <ShoppingCart />,
      label: "Sales",
      to: "/dashboard/sales",
      items: [
        // TODO: Enable when domin is introduced
        // {
        //   label: t("draftOrders.domain"),
        //   to: "/draft-orders",
        // },
      ],
    },
    {
      icon: <Tag />,
      label: "Products",
      to: "/dashboard/products",
      items: [
        {
          label: "Categories",
          to: "/dashboard/categories",
        },
        {
          label: "Brands",
          to: "/dashboard/brands",
        },
        {
          label: "Providers",
          to: "/dashboard/providers",
        },
        // TODO: Enable when domin is introduced
        // {
        //   label: t("giftCards.domain"),
        //   to: "/gift-cards",
        // },
      ],
    },
    {
      icon: <Buildings />,
      label: "Inventory",
      to: "/inventory",
      items: [
        {
          label: "reservations.domain",
          to: "/reservations",
        },
      ],
    },
    {
      icon: <Users />,
      label: "Customers",
      to: "/dashboard/customers",
      items: [
        {
          label: "customerGroups.domain",
          to: "/customer-groups",
        },
      ],
    },
    {
      icon: <ReceiptPercent />,
      label: "Promotions",
      to: "/promotions",
      items: [
        {
          label: "campaigns.domain",
          to: "/campaigns",
        },
      ],
    },
    {
      icon: <CurrencyDollar />,
      label: "Price Lists",
      to: "/price-lists",
    },
  ]
}

const CoreRouteSection = () => {
  const coreRoutes = useCoreRoutes()

  return (
    <nav className="flex flex-col gap-y-1 py-3">
      {coreRoutes.map((route) => {
        return <NavItem key={route.to} {...route} />
      })}
    </nav>
  )
}

const Logout = () => {
  const router = useRouter()

  const handleLogout = async () => {
    localStorage.removeItem('token');
    router.push('/');

}

return (
  <DropdownMenu.Item onClick={handleLogout}>
    <div className="flex items-center gap-x-2">
      <OpenRectArrowOut className="text-ui-fg-subtle" />
      <span>Logout</span>
    </div>
  </DropdownMenu.Item>
)
}

const Header = () => {

  const store = {
    name: "Botica Real",
  }

  const isPending = false
  const isError = false
  const error = null

  const name = store?.name
  const fallback = store?.name?.slice(0, 1).toUpperCase()

  const isLoaded = !isPending && !!store && !!name && !!fallback

  if (isError) {
    throw error
  }

  return (
    <div className="w-full p-3">
      <DropdownMenu>
        <DropdownMenu.Trigger
          disabled={!isLoaded}
          className={clx(
            "bg-ui-bg-subtle transition-fg grid w-full grid-cols-[24px_1fr_15px] items-center gap-x-3 rounded-md p-0.5 pr-2 outline-none",
            "hover:bg-ui-bg-subtle-hover",
            "data-[state=open]:bg-ui-bg-subtle-hover",
            "focus-visible:shadow-borders-focus"
          )}
        >
          {fallback ? (
            <Avatar variant="squared" size="xsmall" fallback={fallback} />
          ) : (
            <Skeleton className="h-6 w-6 rounded-md" />
          )}
          <div className="block overflow-hidden text-left">
            {name ? (
              <Text
                size="small"
                weight="plus"
                leading="compact"
                className="truncate"
              >
                {store.name}
              </Text>
            ) : (
              <Skeleton className="h-[9px] w-[120px]" />
            )}
          </div>
          <EllipsisHorizontal className="text-ui-fg-muted" />
        </DropdownMenu.Trigger>
        {isLoaded && (
          <DropdownMenu.Content className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0">
            <div className="flex items-center gap-x-3 px-2 py-1">
              <Avatar variant="squared" size="small" fallback={fallback} />
              <div className="flex flex-col overflow-hidden">
                <Text
                  size="small"
                  weight="plus"
                  leading="compact"
                  className="truncate"
                >
                  {name}
                </Text>
                <Text
                  size="xsmall"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {}
                {new Date().toLocaleDateString()}
                </Text>
              </div>
            </div>
            <DropdownMenu.Separator />
            <DropdownMenu.Separator />
            <Logout />
          </DropdownMenu.Content>
        )}
      </DropdownMenu>
    </div>
  )
}

const Gutter = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full max-w-[1600px] flex-col gap-y-2 p-3">
      {children}
    </div>
  )
}

export const Breadcrumbs = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const crumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = segment.charAt(0).toUpperCase() + segment.slice(1)

    return {
      label: label,
      path: path,
    }
  })

  return (
    <ol
      className={clx(
        "text-ui-fg-muted txt-compact-small-plus flex select-none items-center"
      )}
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1
        const isSingle = crumbs.length === 1

        return (
          <li key={index} className={clx("flex items-center")}>
            {!isLast ? (
              <Link
                className="transition-fg hover:text-ui-fg-subtle"
                href={crumb.path}
              >
                {crumb.label}
              </Link>
            ) : (
              <div>
                {!isSingle && <span className="block lg:hidden">...</span>}
                <span
                  key={index}
                  className={clx({
                    "hidden lg:block": !isSingle,
                  })}
                >
                  {crumb.label}
                </span>
              </div>
            )}
            {!isLast && (
              <span className="mx-2">
                <TriangleRightMini />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

const ToggleSidebar = () => {
  const { toggle } = useSidebar()

  return (
    <div>
      <IconButton
        className="hidden lg:flex"
        variant="transparent"
        onClick={() => toggle("desktop")}
        size="small"
      >
        <SidebarLeft className="text-ui-fg-muted" />
      </IconButton>
      <IconButton
        className="hidden max-lg:flex"
        variant="transparent"
        onClick={() => toggle("mobile")}
        size="small"
      >
        <SidebarLeft className="text-ui-fg-muted" />
      </IconButton>
    </div>
  )
}

const Topbar = () => {
  return (
    <div className="grid w-full grid-cols-2 border-b p-3">
      <div className="flex items-center gap-x-1.5">
        <ToggleSidebar />
        <Breadcrumbs />
      </div>
      {/* <div className="flex items-center justify-end gap-x-3">
        <Notifications />
      </div> */}
    </div>
  )
}

const DesktopSidebarContainer = ({ children }: PropsWithChildren) => {
  const { desktop } = useSidebar()

  return (
    <div
      className={clx("hidden h-screen w-[220px] border-r", {
        "lg:flex": desktop,
      })}
    >
      {children}
    </div>
  )
}

const MobileSidebarContainer = ({ children }: PropsWithChildren) => {
  const { mobile, toggle } = useSidebar()

  return (
    <Dialog.Root open={mobile} onOpenChange={() => toggle("mobile")}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={clx(
            "bg-ui-bg-overlay fixed inset-0",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <Dialog.Content
          className={clx(
            "bg-ui-bg-subtle shadow-elevation-modal fixed inset-y-2 left-2 flex w-full max-w-[304px] flex-col overflow-hidden rounded-lg border-r",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 duration-200"
          )}
        >
          <div className="p-3">
            <Dialog.Close asChild>
              <IconButton
                size="small"
                variant="transparent"
                className="text-ui-fg-subtle"
              >
                <XMark />
              </IconButton>
            </Dialog.Close>
            <Dialog.Title className="sr-only">
              Sidebar
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Botica Real
            </Dialog.Description>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
