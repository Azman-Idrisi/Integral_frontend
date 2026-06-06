import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "saved_credentials";

export const saveCredentials = async (
  username: string,
  password: string
) => {
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify({
      username,
      password,
    })
  );
};

export const getCredentials = async () => {
  const data = await AsyncStorage.getItem(KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
};

export const clearCredentials = async () => {
  await AsyncStorage.removeItem(KEY);
};