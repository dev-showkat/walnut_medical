export const handleLogin = (data) => {
  return {
    type: "HANDLE_LOGIN",
    payload: data,
  };
};

export const handleLogoutAc = (data) => {
  return {
    type: "HANDLE_LOGOUT",
    payload: data,
  };
};

export const updateUserToken = (data) => {
  return {
    type: "UPDATE_TOKEN",
    payload: data,
  };
};

export const saveActiveLine = (data) => {
  return {
    type: "SAVE_ACTIVE_LINE",
    payload: data,
  };
};

export const logoutActiveLine = (data) => {
  return {
    type: "LOGOUT_ACTIVE_LINE",
    payload: data,
  };
};

export const ActiveBatch = (data) => {
  return {
    type: "ACTIVE_BATCH",
    payload: data,
  };
};
export const logoutActiveSystem = (data) => {
  return {
    type: "LOGOUT_ACTIVE_SYSTEM",
    payload: data,
  };
};

export const saveActiveSystem = (data) => {
  return {
    type: "SAVE_ACTIVE_SYSTEM",
    payload: data,
  };
};
