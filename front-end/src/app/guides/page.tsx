"use client"

import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  PenLine, 
  Heart,
  Hash, 
  Users, 
  Search,
  BookOpen
} from "lucide-react"

export default function GuidesPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Guides</h1>
            <p className="text-muted-foreground">
              Learn how to make the most of DEV
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div className="grid gap-6">
              <section>
                <div className="flex items-center space-x-2">
                  <PenLine className="h-6 w-6" />
                  <h2 className="text-xl font-semibold m-0">Writing Posts</h2>
                </div>
                <p>
                  Share your knowledge by writing articles. Our editor supports Markdown for easy formatting.
                  Add code snippets, images, and more to make your posts engaging.
                </p>
                <Button asChild variant="outline">
                  <Link href="/posts/new">Try Writing a Post</Link>
                </Button>
              </section>

              <section>
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6" />
                  <h2 className="text-xl font-semibold m-0">Interactions</h2>
                </div>
                <p>
                  Engage with content by liking posts, saving them to your reading list,
                  and leaving thoughtful comments. Build your reputation in the community.
                </p>
                <ul>
                  <li>Like posts to show appreciation</li>
                  <li>Bookmark posts to read later</li>
                  <li>Comment to start discussions</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center space-x-2">
                  <Hash className="h-6 w-6" />
                  <h2 className="text-xl font-semibold m-0">Tags</h2>
                </div>
                <p>
                  Tags help categorize content and make it discoverable. Add relevant tags to your posts
                  and follow tags you&apos;re interested in.
                </p>
                <Button asChild variant="outline">
                  <Link href="/tags">Browse Tags</Link>
                </Button>
              </section>

              <section>
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6" />
                  <h2 className="text-xl font-semibold m-0">Following</h2>
                </div>
                <p>
                  Follow other developers to see their posts in your feed. Build your network
                  and stay updated with content from people you trust.
                </p>
              </section>

              <section>
                <div className="flex items-center space-x-2">
                  <Search className="h-6 w-6" />
                  <h2 className="text-xl font-semibold m-0">Search</h2>
                </div>
                <p>
                  Find posts on specific topics using the search feature. Filter by tags,
                  authors, or keywords to discover relevant content.
                </p>
              </section>

              <section>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6" />
                  <h2 className="text-xl font-semibold m-0">Reading List</h2>
                </div>
                <p>
                  Save posts to your reading list to access them later. It&apos;s a great way
                  to keep track of articles you want to read or reference.
                </p>
                <Button asChild variant="outline">
                  <Link href="/reading-list">View Reading List</Link>
                </Button>
              </section>
            </div>

            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h2 className="text-xl font-semibold mt-0">Need More Help?</h2>
              <p className="mb-4">
                If you have any questions or need assistance, don&apos;t hesitate to reach out.
                We&apos;re here to help!
              </p>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 