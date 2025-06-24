import CollectionDetail from "@/components/pages/collection/collection-detail";

export default async function CollectionDetailPage({
  params,
}: {
  params: { collectionId: string };
}) {
  const paramsObject = await params;

  return <CollectionDetail collectionId={paramsObject.collectionId} />;
}
