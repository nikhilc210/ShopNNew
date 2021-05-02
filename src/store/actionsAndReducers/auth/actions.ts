/**
 * Auth Actions
 * */

// Dispatching Actions
export const LOGIN: string = 'LOGIN';
export const LOGOUT: string = 'LOGOUT';
export const CHECK_AUTH: string = 'CHECK_AUTH';
export const LOGIN_SUCCESSFUL: string = 'LOGIN_SUCCESSFUL';
export const LOGIN_FAILED: string = 'LOGIN_FAILED';
export const UPDATE_USER_DATA: string = 'UPDATE_USER_DATA';

export function login(token, user) {
  return {
    type: LOGIN,
    token,
    user,
  };
}
export function logout() {
  return {
    type: LOGOUT,
  };
}

export function updateUserData(user) {
  return {
    type: UPDATE_USER_DATA,
    user,
  };
}
