import {LOGIN, LOGOUT, UPDATE_USER_DATA} from './actions';
import {UserDetails} from './userDetails';

export interface AuthState {
  loggedInStatus: boolean;
  auth_token: string;
  userDataLoading: string;
  user: UserDetails;
}

const initialAuthState: AuthState = {
  loggedInStatus: false,
  auth_token: '',
  userDataLoading: '',
  user: {
    id: '',
    name: '',
    email: '',
    mobile_no: '',
    imgUrl: '',
    address: [],
  },
};

export const authReducer = (state = initialAuthState, action: any) => {
  // Login Reducer
  if (action.type === LOGIN) {
    const {user} = action;
    return {
      ...state,
      loggedInStatus: true,
      auth_token: action.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile_no: user.mobile_no,
        imgUrl:
          user.img_url === null
            ? 'https://pecb.com/conferences/wp-content/uploads/2017/10/no-profile-picture.jpg'
            : user.imgUrl,
        address: JSON.parse(user.address),
      },
    };
  }

  // Logout reducer
  else if (action.type === LOGOUT) {
    return {
      ...initialAuthState,
    };
  }

  // User Data update reducer
  else if (action.type === UPDATE_USER_DATA) {
    const {user} = action;
    return {
      ...state,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile_no: user.mobile_no,
        imgUrl:
          user.img_url === null
            ? 'https://pecb.com/conferences/wp-content/uploads/2017/10/no-profile-picture.jpg'
            : user.imgUrl,
        address: JSON.parse(user.address),
      },
    };
  }

  // Default Reducer
  else {
    return state;
  }
};
