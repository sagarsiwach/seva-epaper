import { redirect } from "next/navigation"
import { getLatestEdition } from "@/lib/editions"

export default function HomePage() {
  const latest = getLatestEdition()

  if (latest) {
    redirect(`/${latest.id}`)
  }

  // No editions available
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">E-Paper Viewer</h1>
        <p className="text-muted-foreground">
          No editions available yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Add edition folders to <code>public/editions/</code>
        </p>
      </div>
    </div>
  )
}
