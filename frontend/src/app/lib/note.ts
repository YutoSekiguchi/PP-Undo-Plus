import { TLNoteData, TLPostNoteData } from "@/@types/note";

const NOTE_API_URL = `${process.env.API_URL}/notes`;

// get a note by id
export const getNoteByID = async (id: number) => {
  const url = `${NOTE_API_URL}/${id}`;
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
}

// get notes by collection_id
export const getNotesByCollectionID = async (collectionID: number) => {
  const url = `${NOTE_API_URL}/collection/${collectionID}`;
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
}

// get notes by user_id
export const getNotesByUserID = async (userID: number) => {
  const url = `${NOTE_API_URL}/user/${userID}`;
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
}

// create note
export const createNote = async (data: TLPostNoteData) => {
  const url = `${NOTE_API_URL}`;
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
}

// update note
export const updateNote = async (data: TLNoteData) => {
  const url = `${NOTE_API_URL}/${data.ID}`;
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
}

// delete note
export const deleteNote = async (id: number) => {
  const url = `${NOTE_API_URL}/${id}`;
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
}
