import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/nextPrev.scss"
import { resolveRelative } from "../util/path"
import { classNames } from "../util/lang"

function getDirectory(filePath: string): string {
  const parts = filePath.replace(/\\/g, "/").split("/")
  parts.pop()
  return parts.join("/")
}

export default (() => {
  const NextPrev: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {
    const currentPath = fileData.relativePath
    if (!currentPath || fileData.slug === "index" || fileData.slug?.endsWith("/index")) {
      return null
    }

    const currentDir = getDirectory(currentPath)
    if (!currentDir) {
      return null
    }

    // Filter siblings in the same directory (excluding index.md)
    const siblings = allFiles
      .filter((file) => {
        if (!file.relativePath || file.slug === "index" || file.slug?.endsWith("/index")) {
          return false
        }
        return getDirectory(file.relativePath) === currentDir
      })
      .sort((a, b) => {
        const orderA = a.frontmatter?.order !== undefined ? Number(a.frontmatter.order) : 999
        const orderB = b.frontmatter?.order !== undefined ? Number(b.frontmatter.order) : 999
        if (orderA !== orderB) {
          return orderA - orderB
        }
        return (a.frontmatter?.title ?? a.slug ?? "").localeCompare(
          b.frontmatter?.title ?? b.slug ?? "",
        )
      })

    const currentIndex = siblings.findIndex((f) => f.slug === fileData.slug)
    if (currentIndex === -1) {
      return null
    }

    const prev = currentIndex > 0 ? siblings[currentIndex - 1] : null
    const next = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null

    if (!prev && !next) {
      return null
    }

    return (
      <div class={classNames(displayClass, "next-prev-container")}>
        {prev ? (
          <a class="next-prev-link prev" href={resolveRelative(fileData.slug!, prev.slug!)}>
            <span class="next-prev-label">← Modul Sebelumnya</span>
            <span class="next-prev-title">{prev.frontmatter?.title ?? prev.slug}</span>
          </a>
        ) : (
          <div class="next-prev-spacer" />
        )}
        {next ? (
          <a class="next-prev-link next" href={resolveRelative(fileData.slug!, next.slug!)}>
            <span class="next-prev-label">Modul Selanjutnya →</span>
            <span class="next-prev-title">{next.frontmatter?.title ?? next.slug}</span>
          </a>
        ) : (
          <div class="next-prev-spacer" />
        )}
      </div>
    )
  }

  NextPrev.css = style
  return NextPrev
}) satisfies QuartzComponentConstructor
