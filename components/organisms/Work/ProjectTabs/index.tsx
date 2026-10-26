'use client';

import { useEffect, useState } from 'react';

import type { Project } from '@/app/work/projects';
import { workTransition } from '@/lib/workTransition';
import ProjectTab from './ProjectTab';

// The drop-in entrance plays on the first visit only: coming back from a
// project, the tabs must be in place for the hero to morph back into one.
let hasPlayedEntrance = false;

export default function ProjectTabs({ projects }: { projects: Project[] }) {
  // One tab open at a time: keeps the page short and the WebGL contexts few
  // (stickers only mount inside an open tab).
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [playEntrance] = useState(() => !hasPlayedEntrance);
  // Leaving: every tab but the opened one slides down out of the way.
  const [leavingSlug, setLeavingSlug] = useState<string | null>(null);
  // Returning from a project: every tab but that project's slides back up
  // (that one is the shared card the hero morphs into).
  const [returningFrom, setReturningFrom] = useState(() =>
    hasPlayedEntrance ? workTransition.lastProjectSlug : null,
  );

  useEffect(() => {
    hasPlayedEntrance = true;
    // Only needed for the transition that brought us here.
    const timer = window.setTimeout(() => setReturningFrom(null), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const slideRole = (slug: string) => {
    if (leavingSlug) return slug === leavingSlug ? null : 'tab-exit';
    if (returningFrom) return slug === returningFrom ? null : 'tab-enter';
    return null;
  };

  return (
    <ol className="flex flex-col">
      {projects.map((project, index) => (
        <ProjectTab
          key={project.slug}
          project={project}
          index={index}
          playEntrance={playEntrance}
          slideRole={slideRole(project.slug)}
          onLeave={() => setLeavingSlug(project.slug)}
          isOpen={openSlug === project.slug}
          onToggle={() =>
            setOpenSlug((current) =>
              current === project.slug ? null : project.slug,
            )
          }
        />
      ))}
    </ol>
  );
}
