import { MainNav } from "@/components/main-nav"
import { PostList } from "@/components/post-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              DEV Community
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              A constructive and inclusive social network for software developers. With you every step of your journey.
            </p>
            <Button asChild className="mt-4">
              <Link href="/posts/new">Create a Post</Link>
            </Button>
          </div>
        </section>
        <section className="container py-10">
          <PostList />
        </section>
      </main>
    </div>
  )
}
