import { useAtom } from "jotai";
import { selectedCollectionAtom } from "@/app/hooks/atoms/collection";
import { TLCollectionData } from "@/@types/collection";

export const useSelectedCollection = () => {
  const [selectedCollection, setSelectedCollection] = useAtom(
    selectedCollectionAtom
  );

  const selectCollection = (collection: TLCollectionData) => {
    setSelectedCollection(collection);
  };

  const clearSelectedCollection = () => {
    setSelectedCollection(null);
  };

  return {
    selectedCollection,
    selectCollection,
    clearSelectedCollection,
  };
};