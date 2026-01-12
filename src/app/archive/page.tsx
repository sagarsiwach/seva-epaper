import Link from "next/link"
import { getEditions } from "@/lib/editions"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, FileText } from "lucide-react"

export default function ArchivePage() {
  const editions = getEditions()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h1 className="font-semibold">Archive</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container px-4 py-6">
        {editions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold">No editions yet</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add edition folders to <code>public/editions/</code>
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {editions.map((edition) => (
              <Link
                key={edition.id}
                href={`/${edition.id}`}
                className="group block border bg-card hover:border-primary/50 transition-colors"
              >
                {/* Cover image */}
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  {edition.coverImage ? (
                    <img
                      src={edition.coverImage}
                      alt={edition.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 border-t">
                  <h3 className="font-medium">{edition.title}</h3>
                  <div className="flex items-center justify-between mt-1 text-sm text-muted-foreground">
                    <span>{edition.date}</span>
                    <span>{edition.pageCount} pages</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
