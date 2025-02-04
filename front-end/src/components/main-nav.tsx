"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">DEV</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Home
            </Link>
            <Link
              href="/reading-list"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/reading-list" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Reading List
            </Link>
            <Link
              href="/tags"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/tags" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Tags
            </Link>
          </nav>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/register">Create account</Link>
          </Button>
        </div>
      </div>
    </header>
  )
} 