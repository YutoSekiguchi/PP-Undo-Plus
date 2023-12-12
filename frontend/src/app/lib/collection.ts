import { TLPostCollectionData } from "@/@types/collection";

const COLLECTION_API_URL = `${process.env.API_URL}/collections`;

// get collection by user_id
export const getCollectionsByUserID = async (userID: number) => {
  const url = `${COLLECTION_API_URL}/user/${userID}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was an error!", error);
    return null;
  }
};

// get collection by id
export const getCollectionByID = async (id: number) => {
  const url = `${COLLECTION_API_URL}/${id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was an error!", error);
    return null;
  }
};

// create collection
export const createCollection = async (data: TLPostCollectionData) => {
  const url = `${COLLECTION_API_URL}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

// update collection
export const updateCollection = async (id: number, data: TLPostCollectionData) => {
  const url = `${COLLECTION_API_URL}/${id}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

// delete collection
export const deleteCollection = async (id: number) => {
  const url = `${COLLECTION_API_URL}/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was an error!", error);
  }
};
