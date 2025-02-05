"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { PostList } from "@/components/post-list"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Welcome to DEV Community
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A social network for software developers. With you every step of your journey.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {!isAuthenticated ? (
                    <Button asChild size="lg" className="bg-primary text-primary-foreground">
                      <Link href="/auth/register">Create account</Link>
                    </Button>
                  ) : null}
                  <Button asChild variant="outline" size="lg">
                    <Link href="/posts/new">Write a Post</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto flex w-full items-center justify-center">
                <div className="space-y-4 backdrop-blur-[2px] rounded-lg border bg-background/95 p-8 shadow-lg">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight">
                      Popular Tags
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Explore topics that interest you
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["javascript", "webdev", "programming", "beginners", "react", "python"].map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${tag}`}
                        className="inline-flex items-center rounded-md border px-2.5 py-1.5 text-sm font-semibold transition-colors hover:bg-muted"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Latest Posts</h2>
                <Button asChild variant="ghost">
                  <Link href="/latest">View all</Link>
                </Button>
              </div>
              <PostList />
            </div>
            <aside className="hidden lg:block space-y-6">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold mb-2">Writing on DEV</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  DEV is a community of amazing developers. We're a place where coders share, stay up-to-date and grow their careers.
                </p>
                <Button asChild className="w-full">
                  <Link href="/posts/new">Create a Post</Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold mb-2">DEV Community</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides" className="text-muted-foreground hover:text-foreground">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/software-comparisons" className="text-muted-foreground hover:text-foreground">
                      Software Comparisons
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
