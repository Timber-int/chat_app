export const host = 'http://localhost:5000';
export const registerRoute = `${host}/api/auth/registration`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
export const getUsersRoute = `${host}/api/auth/users`;
export const sendMessageRoute = `${host}/api/messages/addMsg/`;
export const getMessageRoute = `${host}/api/messages/getMsg/`;
export const deleteMessageRoute = (id) => `${host}/api/messages/deleteMsg/${id}`;
export const updateMessageRoute = (id) => `${host}/api/messages/updateMsg/${id}`;
