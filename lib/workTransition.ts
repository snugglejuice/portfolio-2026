// Last project page shown, so /work knows which tab the hero morphs back
// into (that one is handled by React's shared <ViewTransition>); every other
// tab slides in on return instead.
export const workTransition = { lastProjectSlug: null as string | null };
