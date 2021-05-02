import {CHANGE_ROUTE} from './actions';

export interface RouteState {
  routeName: string | undefined;
}

const initialRouteState: RouteState = {routeName: undefined};

export const routeReducer = (state = initialRouteState, action: any) => {
  if (action.type === CHANGE_ROUTE) {
    return {
      ...state,
      routeName: action.routeName,
    };
  } else {
    return state;
  }
};
