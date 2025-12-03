"use client"

import { useEffect, useState } from "react"
import { 
  AlertCircle, 
  BarChart3, 
  FileText, 
  Home, 
  Search, 
  TrendingUp, 
  Database,
  Bell,
  GraduationCap,
  Settings,
  User,
  Moon,
  Sun,
  LogOut
} from "lucide-react"
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "./animate-ui/components/radix/sidebar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./animate-ui/components/radix/dropdown-menu"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "./animate-ui/components/radix/avatar"
import Image from "next/image"

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Tech explorer",
    url: "search",
    icon: Search,
  },
  {
    title: "Technology Details",
    url: "tech-detail",
    icon: Database,
  },
  {
    title: "Forecasting & Models",
    url: "forecasting",
    icon: TrendingUp,
  },
  {
    title: "Alerts & Monitoring",
    url: "alerts",
    icon: Bell,
  },
  {
    title: "Reports",
    url: "reports",
    icon: FileText,
  },
  {
    title: "Admin",
    url: "admin-ingestion",
    icon: Settings,
  },
  {
    title: "Onboarding",
    url: "onboarding",
    icon: GraduationCap,
  },
]

export function AppSidebar() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { state } = useSidebar()
  const [mounted, setMounted] = useState(false)

  // avoid hydration mismatch with next-themes
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    // theme-aware classes: light -> bg-white / dark -> slate-900
    <Sidebar className="bg-white text-black dark:bg-slate-900 dark:text-white border-r border-border">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="IntelForge Logo"
              width={40}
              height={40}
              className="object-contain block"
              priority
            />
          </div>

          {state === "expanded" && (
            <span className="font-extrabold text-lg leading-none text-black dark:text-white">
              IntelForge
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted/60 dark:hover:bg-white/5 transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="truncate">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src="/avatar.png" alt="User" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>

                    {state === "expanded" && (
                      <div className="flex flex-col items-start flex-1 overflow-hidden">
                        <span className="text-sm font-medium truncate text-foreground">Aditya</span>
                        <span className="text-xs text-muted-foreground truncate">aditya@intelforge.com</span>
                      </div>
                    )}
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Theme</DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="flex items-center gap-2"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                  {/* only show check after mount to avoid mismatch */}
                  {mounted && (resolvedTheme ?? theme) === "light" && (
                    <span className="ml-auto">✓</span>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="flex items-center gap-2"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                  {mounted && (resolvedTheme ?? theme) === "dark" && (
                    <span className="ml-auto">✓</span>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="flex items-center gap-2"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>System</span>
                  {mounted && (resolvedTheme ?? theme) === "system" && (
                    <span className="ml-auto">✓</span>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex items-center gap-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
