import CollectionDetail from "@/components/pages/collection/collection-detail";

type PageProps = {
  params: Promise<{
    collectionId: string;
  }>;
};

export default async function CollectionDetailPage({
  params,
}: PageProps) {
  const paramsObject = await params;

  return <CollectionDetail collectionId={paramsObject.collectionId} />;
}
