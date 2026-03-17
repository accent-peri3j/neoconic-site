import { useSEO } from "../hooks/useSEO";
import { OG_IMAGE_URL } from "../components/HeadMeta";
import { ProjectLogo, FadeIn } from "../components/project-card";
import {
  ProjectMediaCarousel,
  type MediaItem,
} from "../components/ProjectMediaCarousel";
import { PROJECTS, type Project } from "../data/projects";

const ACCENT = "#EB1A22";

/* ── Build a flat list of ≤ 5 MediaItems per project ── */
function getMediaItems(project: Project): MediaItem[] {
  const items: MediaItem[] = [];

  /* 1 — Hero / poster image always first */
  items.push({
    type: "image",
    src: project.image,
    alt: project.title,
  });

  /* 2 — YouTube video second (if present) */
  if (project.youtubeId) {
    items.push({
      type: "youtube",
      src: project.youtubeId,
      alt: `${project.title} brand film`,
    });
  }

  /* 3 — Gallery images (skip YouTube dupes and hero dupes) */
  for (const asset of project.gallery) {
    if (items.length >= 5) break;
    if (asset.type === "youtube") continue; // already added above
    if (asset.src === project.image) continue; // skip hero dupe
    items.push({
      type: "image",
      src: asset.src,
      alt: asset.alt,
    });
  }

  return items.slice(0, 5);
}

/* ═══════════════════════════════════════════════════════
   PROJECT SECTION — media carousel + info
   ═══════════════════════════════════════════════════════ */
function ProjectSection({
  project,
  index,
  totalCount,
}: {
  project: Project;
  index: number;
  totalCount: number;
}) {
  const mediaItems = getMediaItems(project);

  return (
    <section
      id={project.id}
      style={{
        paddingBottom:
          index < totalCount - 1
            ? "clamp(100px, 10vw, 180px)"
            : "clamp(60px, 6vw, 100px)",
      }}
    >
      {/* Media carousel */}
      <FadeIn delay={0.05}>
        <ProjectMediaCarousel items={mediaItems} />
      </FadeIn>

      {/* Project info */}
      <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
        {/* Left — Logo + title + description */}
        <FadeIn delay={0.1} className="md:col-span-7">
          {/* Logo — sits above the title, consistent sizing */}
          <div
            className="mb-5"
            style={{ opacity: 0.5 }}
          >
            <div
              className="flex items-center"
              style={{ height: "20px" }}
            >
              <ProjectLogo projectId={project.id} />
            </div>
          </div>

          <h2
            className="text-white mb-4"
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {project.title}
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.525)",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "460px",
            }}
          >
            {project.description}
          </p>
          {project.longDescription && (
            <p
              className="mt-3"
              style={{
                color: "rgba(255,255,255,0.525)",
                fontSize: "1rem",
                lineHeight: 1.7,
                maxWidth: "460px",
              }}
            >
              {project.longDescription}
            </p>
          )}
          <p
            className="mt-4 text-xs"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            {project.location.city}, {project.location.country}
          </p>
        </FadeIn>

        {/* Right — Scope */}
        <FadeIn delay={0.15} className="md:col-span-5 md:pt-0">
          <p
            className="text-[11px] uppercase tracking-[0.2em] mb-5"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            Scope
          </p>
          <ul className="flex flex-col gap-2.5">
            {project.scope.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm"
                style={{ color: "rgba(255,255,255,0.52)" }}
              >
                <span
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ background: ACCENT }}
                />
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   WORK PAGE
   ═══════════════════════════════════════════════════════ */
export function Work() {
  useSEO({
    title: "Work",
    description:
      "A curated selection of brand, product, and marketing work for fintech and technology companies including Bluecode, NumberX, Paydora, Baqme, and Better Deals.",
    path: "/work",
    ogImage: OG_IMAGE_URL,
  });

  return (
    <div style={{ background: "#0B0B0B" }}>
      {/* Page header */}
      <div className="pt-40 md:pt-48 pb-20 md:pb-28 px-8 md:px-12 lg:px-16">
        <div className="max-w-[1440px] mx-auto">
          <p
            className="text-xs uppercase tracking-[0.25em] mb-6"
            style={{ color: ACCENT }}
          >
            <span
              className="inline-block w-[5px] h-[5px] rounded-full mr-3 align-middle"
              style={{ background: ACCENT }}
            />
            Portfolio
          </p>
          <h1
            className="text-white max-w-[700px]"
            style={{
              fontSize: "clamp(2.75rem, 7vw, 6rem)",
              fontWeight: 500,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            Our work
          </h1>
        </div>
      </div>

      {/* Project sections */}
      <div className="px-8 md:px-12 lg:px-16">
        <div className="max-w-[1440px] mx-auto">
          {PROJECTS.map((project, i) => (
            <ProjectSection
              key={project.id}
              project={project}
              index={i}
              totalCount={PROJECTS.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}