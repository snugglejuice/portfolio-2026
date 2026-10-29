import StickerImage from '@/components/atoms/StickerImage';
import type { ProjectMedia } from '@/app/work/projects';

// Consecutive "half" items share a row; "full" items take one each.
function toRows(gallery: ProjectMedia[]) {
  const rows: ProjectMedia[][] = [];
  for (const media of gallery) {
    const lastRow = rows.at(-1);
    if (
      media.layout === 'half' &&
      lastRow?.length === 1 &&
      lastRow[0].layout === 'half'
    ) {
      lastRow.push(media);
    } else {
      rows.push([media]);
    }
  }
  return rows;
}

function GalleryCard({
  media,
  backColor,
  sizes,
}: {
  media: ProjectMedia;
  backColor: string;
  sizes: string;
}) {
  const isVideo = media.type === 'video';
  const ratio = media.width / media.height;

  return (
    <div className="bg-foreground rounded-3xl p-6 md:p-10 flex items-center justify-center">
      {/* Portrait captures stay within the viewport height. */}
      <div className="w-full" style={{ maxWidth: `calc(78vh * ${ratio})` }}>
        <StickerImage
          src={isVideo && media.poster ? media.poster : media.src}
          videoSrc={isVideo ? media.src : undefined}
          alt={media.alt}
          width={media.width}
          height={media.height}
          backColor={backColor}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

export default function ProjectGallery({
  gallery,
  backColor,
}: {
  gallery: ProjectMedia[];
  backColor: string;
}) {
  return (
    <section aria-label="Gallery" className="flex flex-col gap-4">
      {toRows(gallery).map((row) =>
        row.length === 1 ? (
          <GalleryCard
            key={row[0].src}
            media={row[0]}
            backColor={backColor}
            // Width left inside the page and card padding.
            sizes="(min-width: 768px) calc(100vw - 112px), calc(100vw - 80px)"
          />
        ) : (
          <div key={row[0].src} className="grid md:grid-cols-2 gap-4">
            {row.map((media) => (
              <GalleryCard
                key={media.src}
                media={media}
                backColor={backColor}
                sizes="(min-width: 768px) calc(50vw - 88px), calc(100vw - 80px)"
              />
            ))}
          </div>
        ),
      )}
    </section>
  );
}
