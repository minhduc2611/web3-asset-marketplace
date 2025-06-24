import GraphExplorer from "@/components/pages/graph-explorer";

type PageProps = {
  params: Promise<{
    canvasId: string;
  }>;
};

const GraphExplorerPage = async ({
  params,
}: PageProps) => {
  const paramsObject = await params;
  const canvasId = paramsObject.canvasId;
  return <GraphExplorer canvasId={canvasId} />;
};

export default GraphExplorerPage;
