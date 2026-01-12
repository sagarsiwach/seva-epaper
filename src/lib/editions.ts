import fs from "fs"
import path from "path"
import type { Edition, Page } from "@/types"

const EDITIONS_DIR = path.join(process.cwd(), "public", "editions")

// Parse "Edition XX" folder name to get edition number
function parseEditionNumber(folderName: string): number | null {
  const match = folderName.match(/Edition\s+(\d+)/i)
  return match ? parseInt(match[1], 10) : null
}

// Generate a date from edition number (starting from a base date)
function editionToDate(editionNumber: number): string {
  const baseDate = new Date("2024-06-22")
  baseDate.setDate(baseDate.getDate() + (editionNumber - 1) * 7)
  return baseDate.toISOString().split("T")[0]
}

// Get all image files from a folder
function getImageFiles(folderPath: string): string[] {
  try {
    const files = fs.readdirSync(folderPath)
    return files
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => {
        // Try to extract numbers for sorting
        const numA = parseInt(a.match(/(\d+)/)?.[1] || "0", 10)
        const numB = parseInt(b.match(/(\d+)/)?.[1] || "0", 10)
        return numA - numB
      })
  } catch {
    return []
  }
}

// Load all editions from filesystem
export function getEditions(): Edition[] {
  const editions: Edition[] = []

  if (!fs.existsSync(EDITIONS_DIR)) {
    console.warn(`Editions directory not found: ${EDITIONS_DIR}`)
    return editions
  }

  const folders = fs
    .readdirSync(EDITIONS_DIR)
    .filter((name) => {
      const fullPath = path.join(EDITIONS_DIR, name)
      return fs.statSync(fullPath).isDirectory() && name.startsWith("Edition")
    })
    .sort((a, b) => {
      const numA = parseEditionNumber(a) || 0
      const numB = parseEditionNumber(b) || 0
      return numB - numA // Newest first
    })

  for (const folder of folders) {
    const editionNumber = parseEditionNumber(folder)
    if (!editionNumber) continue

    const folderPath = path.join(EDITIONS_DIR, folder)
    const imageFiles = getImageFiles(folderPath)

    if (imageFiles.length === 0) continue

    const pages: Page[] = imageFiles.map((file, index) => ({
      id: `${folder}-page-${index + 1}`,
      pageNumber: index + 1,
      imageUrl: `/editions/${folder}/${file}`,
      thumbnailUrl: `/editions/${folder}/${file}`,
    }))

    editions.push({
      id: folder.toLowerCase().replace(/\s+/g, "-"),
      title: `Edition ${editionNumber}`,
      date: editionToDate(editionNumber),
      editionNumber,
      coverImage: pages[0]?.imageUrl || "",
      pageCount: pages.length,
      pages,
      createdAt: new Date().toISOString(),
    })
  }

  return editions
}

// Get a single edition by ID
export function getEdition(id: string): Edition | null {
  const editions = getEditions()
  return editions.find((e) => e.id === id) || null
}

// Get the latest edition
export function getLatestEdition(): Edition | null {
  const editions = getEditions()
  return editions[0] || null
}

// Get edition by edition number
export function getEditionByNumber(num: number): Edition | null {
  const editions = getEditions()
  return editions.find((e) => e.editionNumber === num) || null
}
