export const CHANGE_ROUTE: string = 'CHANGE_ROUTE';

export function changeRouteName(routeName: string) {
  return {
    type: CHANGE_ROUTE,
    routeName,
  };
}
