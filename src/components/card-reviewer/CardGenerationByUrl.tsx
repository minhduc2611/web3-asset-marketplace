import useCardGeneration from "@/hooks/flash-cards-collection/useCardGeneration";
import useFlashCardViewer from "@/hooks/flash-cards-collection/useFlashCardViewer";
import { useClientAuthStore } from "@/stores/authentication";

const CardGenerationByUrl = ({collectionId}: {collectionId:number}) => {
  const { user } = useClientAuthStore();

  const {
    generativeFlashCards,
    generativeUrl,
    getFlashCardFromGenerativeUrl,
    createCardByGenerativeCards,
    updateGenerativeUrl,
  } = useCardGeneration();
  if (!user) {
    return <>Authenticated user is not found</>;
  }
  return (
    <div className="flex flex-col items-center h-[1000px]">
      <div className="flex flex-row justify-center w-[550px] mb-12 gap-3">
        <input
          name={"url"}
          type="text"
          value={generativeUrl}
          onChange={(e) => updateGenerativeUrl(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
        <button
          className="border p-2 rounded-lg"
          onClick={() => getFlashCardFromGenerativeUrl(user.id)}
        >
          Generate
        </button>
        <button
          className="border p-2 rounded-lg"
          onClick={() => createCardByGenerativeCards(collectionId)}
          disabled={!generativeFlashCards.length}
        >
          Create
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4 px-28">
        {generativeFlashCards.map((item) => (
          <div key={item.id} className="border p-4">
            <div className="font-bold">{item.term}</div>
            <div>{item.definition}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGenerationByUrl;
