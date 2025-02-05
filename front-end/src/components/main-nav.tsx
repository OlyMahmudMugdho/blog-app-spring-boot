"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

interface User {
  username: string;
  name: string;
  profilePicture?: string;
}

export function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch("http://localhost:8080/api/v1/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
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

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            className="mr-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">DEV</span>
          </Link>
        </div>

        <div className="flex-1" />
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="ghost">
                    <Link href="/posts/new">Write a Post</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href={`/profile/${user.username}`}>Profile</Link>
                  </Button>
                  <Button onClick={handleLogout} variant="ghost">
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">Create account</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/" ? "text-foreground" : "text-foreground/60"
                )}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/reading-list"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/reading-list" ? "text-foreground" : "text-foreground/60"
                )}
                onClick={() => setIsOpen(false)}
              >
                Reading List
              </Link>
              <Link
                href="/tags"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/tags" ? "text-foreground" : "text-foreground/60"
                )}
                onClick={() => setIsOpen(false)}
              >
                Tags
              </Link>
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/posts/new"
                        className="text-foreground/60 hover:text-foreground/80"
                        onClick={() => setIsOpen(false)}
                      >
                        Write a Post
                      </Link>
                      <Link
                        href={`/profile/${user.username}`}
                        className="text-foreground/60 hover:text-foreground/80"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="text-left text-foreground/60 hover:text-foreground/80"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="text-foreground/60 hover:text-foreground/80"
                        onClick={() => setIsOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        href="/auth/register"
                        className="text-foreground/60 hover:text-foreground/80"
                        onClick={() => setIsOpen(false)}
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
} 