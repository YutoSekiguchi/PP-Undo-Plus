import { TLPostUserData } from "@/@types/user";

const USER_API_URL = `${process.env.API_URL}/users`;

// get user by email
export const getUserByEmail = async (email: string) => {
  const url = `${USER_API_URL}/me?email=${email}`;
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

export const signin = async (data: TLPostUserData) => {
  let isExist = false;
  const existUser = await getUserByEmail(data.Email);
  if (existUser !== null) {
    isExist = true;
    return existUser;
  }
  if (!isExist) {
    const url = `${USER_API_URL}`;
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
};
