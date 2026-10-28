// Last project page shown, so /work (or the homepage) knows which card the
// hero morphs back into (that one is handled by React's shared
// <ViewTransition>); every other /work tab slides in on return instead.
// ProjectHero clears it on leaving.
export const workTransition = { lastProjectSlug: null as string | null };
