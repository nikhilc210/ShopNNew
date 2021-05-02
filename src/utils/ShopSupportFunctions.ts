import {getDistance} from 'geolib';
export const SHOP_IS_CLOSED = 'C';
export const SHOP_IS_OPEN = 'O';
export function calculateStatus(
  openingTimes: {
    opening_time: string;
    closing_time: string;
  },
  shop_open: boolean,
) {
  if (!shop_open) {
    return 'C';
  }
  const {opening_time, closing_time} = openingTimes;
  let openingDateTime = new Date();
  let closingDateTime = new Date();
  const [openingHour, openingMin, openingSec] = opening_time
    .toString()
    .split(':');
  const [closingHour, closingMin, closingSec] = closing_time
    .toString()
    .split(':');
  if (closingHour <= openingHour) {
    openingDateTime.setDate(openingDateTime.getDate() - 1);
  }
  openingDateTime.setHours(
    Number(openingHour),
    Number(openingMin),
    Number(openingSec),
  );
  closingDateTime.setHours(
    Number(closingHour),
    Number(closingMin),
    Number(closingSec),
  );
  const rightNow = new Date();
  const status =
    rightNow > openingDateTime && rightNow < closingDateTime ? 'O' : 'C';
  return status;
}

export function calculateDistanceFromShop(userLoc: any, shopLoc: any) {
  const distance = getDistance(userLoc, shopLoc);
  return {
    distance,
    distInText:
      distance < 1000
        ? distance + ' m'
        : (distance * 0.000621371).toFixed(1) + ' miles',
  };
}
