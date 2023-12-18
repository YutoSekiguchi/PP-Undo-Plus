import { TLPostNoteLogData } from "@/@types/note";

const NOTE_LOG_API_URL = `${process.env.API_URL}/note_logs`;

// get a note_log by id
export const getNoteLogByID = async (id: number) => {
  const url = `${NOTE_LOG_API_URL}/${id}`;
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

// get note_logs by note_id
export const getNoteLogsByNoteID = async (noteID: number) => {
  const url = `${NOTE_LOG_API_URL}/note/${noteID}`;
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

// post a note_log
export const createNoteLog = async (data: TLPostNoteLogData) => {
  const url = `${NOTE_LOG_API_URL}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
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