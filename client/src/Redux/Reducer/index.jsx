const iSate = {
  isLogin: false,
  user: {
    token: "",
    token2: "",
    f_name: "",
    l_name: "",
    role: "",
    photo: "",
    employee_id: "",
  },
  LineLogin: {
    line_name: "",
    line_login_time: "",
    type: "",
    isLogedIn: false,
    line_id: "",
    active_batch: "",
  },
  SystemLogin: {
    system_login_time: "",
    type: "",
    isLogedIn: false,
    system_id: "",
  },
};

export const Reducer = (state = iSate, action) => {
  switch (action.type) {
    case "HANDLE_LOGIN": {
      console.log(action);
      return {
        ...state,
        isLogin: true,
        user: {
          ...state.user,
          token: action.payload.id,
          token2: action.payload.token2,
          role: action.payload.role,
          photo: action.payload.photo,
          employee_id: action.payload.employee_id,
          f_name:
            action.payload.f_name == undefined ? "" : action.payload.f_name,
          l_name:
            action.payload.l_name == undefined ? "" : action.payload.l_name,
        },
      };
    }
    case "HANDLE_LOGOUT": {
      return {
        ...state,
        isLogin: false,
        user: {
          ...state.user,
          token: "",
          token2: "",
          photo: "",
          role: "",
          f_name: "",
          l_name: "",
          employee_id: "",
        },
      };
    }
    case "UPDATE_TOKEN": {
      return {
        ...state,
        user: {
          ...state.user,
          token: action.payload.id,
        },
      };
    }
    case "SAVE_ACTIVE_LINE": {
      return {
        ...state,
        LineLogin: {
          ...state.LineLogin,
          line_id: action.payload.line_id,
          line_name: action.payload.line_name,
          line_login_time: action.payload.line_login_time,
          type: action.payload.type,
          isLogedIn: true,
        },
      };
    }
    case "LOGOUT_ACTIVE_LINE": {
      return {
        ...state,
        LineLogin: {
          ...state.LineLogin,
          line_name: "",
          line_login_time: "",
          type: "",
          isLogedIn: false,
          line_id: "",
          active_batch: "",
        },
      };
    }
    case "ACTIVE_BATCH": {
      return {
        ...state,
        LineLogin: {
          ...state.LineLogin,
          active_batch: action.payload.name,
        },
      };
    }
    case "SAVE_ACTIVE_SYSTEM": {
      return {
        ...state,
        SystemLogin: {
          ...state.SystemLogin,
          system_id: action.payload.system_id,
          system_login_time: action.payload.system_login_time,
          type: action.payload.type,
          isLogedIn: true,
        },
      };
    }
    case "LOGOUT_ACTIVE_SYSTEM": {
      return {
        ...state,
        SystemLogin: {
          ...state.SystemLogin,
          system_login_time: "",
          type: "",
          isLogedIn: false,
          system_id: "",
        },
      };
    }

    default:
      return state;
  }
};
