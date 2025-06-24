import ManageFlashcards from "@/components/pages/collection/collection-manage";

type PageProps = {
  params: Promise<{
    collectionId: string;
  }>;
};

export default async function ManageFlashcardsPage({
  params,
}: PageProps) {
  const paramsObject = await params;

  return <ManageFlashcards collectionId={paramsObject.collectionId} />;
}