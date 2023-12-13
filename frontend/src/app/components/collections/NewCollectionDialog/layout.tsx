import { createCollection } from '@/app/lib/collection';
import { useState } from 'react';

interface Props {
  lang: string | string[] | undefined;
  onClose: () => void;
  userID: number;
}

export default function NewCollectionDialog(props: Props) {
  const { lang, onClose, userID } = props;
  const [collectionName, setCollectionName] = useState('');

  const handleCloseDialog = () => {
    setCollectionName('');
    onClose();
  };

  const handleCreateCollection = async() => {
    if (collectionName.length === 0) return;
    try {
      await createCollection({ Title: collectionName, UserID: userID });
    } catch (error) {
      alert('Failed to create collection' + error);
      console.error(error);
    }
    setCollectionName('');
    onClose();
  }

  const handleNameChange = (event: any) => {
    setCollectionName(event.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/2" style={{ minWidth: "400px", maxWidth: "600px" }}>
        <div className="mb-4">
          <h2 className="text-xs text-center text-gray-700">
            {lang === 'en' ? 
            'New Collection'
            :
            '新規コレクション'
            }
          </h2>
        </div>
        <div className="mb-4 text-center">
          <input
            className="w-11/12 p-3 border-none bg-gray-200 rounded-lg focus:outline-none text-xs"
            type="text"
            value={collectionName}
            onChange={handleNameChange}
            placeholder={`${lang === "en"? "Collection Name": "コレクション名"}`}
          />
        </div>
        <div className="flex justify-between w-11/12 mx-auto">
          <button className="text-sky-500 rounded-lg hover:text-sky-300 mt-4" onClick={handleCloseDialog}>
            {lang === "en" ? "Cancel" : "キャンセル"}
          </button>
          <button className={`${collectionName.length > 0? "text-sky-500 hover:text-sky-300": "text-gray-400 cursor-auto"} rounded-lg mt-4`} onClick={handleCreateCollection}>
            {lang === "en" ? "Create" : "作成"}
          </button>
        </div>
      </div>
    </div>
  );
}
