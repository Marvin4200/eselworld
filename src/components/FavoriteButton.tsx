import { toggleFavoriteAction } from "@/lib/actions";

export default function FavoriteButton({
  communityId,
  communitySlug,
  isFavorite,
}: {
  communityId: string;
  communitySlug: string;
  isFavorite: boolean;
}) {
  return (
    <form action={toggleFavoriteAction}>
      <input type="hidden" name="communityId" value={communityId} />
      <input type="hidden" name="communitySlug" value={communitySlug} />
      <button
        type="submit"
        aria-pressed={isFavorite}
        title={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        className={`rounded-full border px-6 py-3 text-center font-medium transition ${
          isFavorite
            ? "border-accent bg-accent-soft text-accent-ink"
            : "border-line text-ink hover:border-teal"
        }`}
      >
        {isFavorite ? "★ Favorisiert" : "☆ Favorisieren"}
      </button>
    </form>
  );
}
