// src/state/actions.js
export const logoutUser = () => {
    return (dispatch) => {
      localStorage.removeItem('user'); 
      dispatch({ type: "LOGOUT" }); 
    };
  };
  