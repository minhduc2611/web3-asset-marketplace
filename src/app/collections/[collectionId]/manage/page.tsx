import ManageFlashcards from "@/components/pages/collection/collection-manage";

export default function ManageFlashcardsPage({
  params,
}: {
  params: { collectionId: string };
}) {
  return <ManageFlashcards collectionId={params.collectionId} />;
}