import {LOAD_SHOPS, NOT_LOADED_SHOP} from './actions';
import {TransformedShop} from '../../types/shop';

export interface ShopStore {
  shopsLoaded: boolean;
  shops: TransformedShop[] | null;
}

const initialState: ShopStore = {
  shopsLoaded: false,
  shops: null,
};

export const shopsReducer = (state = initialState, action) => {
  if (action.type === LOAD_SHOPS) {
    // console.log(action.shops[0].shop_open);
    return {
      ...state,
      shopsLoaded: true,
      shops: action.shops.map((shop) => ({
        id: shop.id,
        shopName: shop.name,
        category: shop.shop_type,
        // status: 'O',
        description: shop.shop_description,
        location: {
          latitude: shop.latitude,
          longitude: shop.longitude,
        },
        ratingsCount:
          typeof shop?.rating === 'string'
            ? Number(shop?.rating).toPrecision(2)
            : shop?.rating,
        reviewCount: shop?.review?.toFixed(2),
        deliveryAvailability: shop.supports_delivery === 1,
        deliveryCharge: shop.delivery_fee,
        backgroundImageUrl: JSON.parse(shop.images).coverPhoto,
        imageUrl: JSON.parse(shop.images).storeLogo,
        openTimings: {
          opening_time: shop.opening_time,
          closing_time: shop.closing_time,
        },
        postal_code: shop.postal_code,
        mobile_number: '+44' + shop.mobile_number,
        address: shop.address,
        shop_open: shop.shop_open === 1,
        minimum_order_fee: shop.minimum_order_fee,
      })),
    };
  } else if (action.type === NOT_LOADED_SHOP) {
    return {
      ...state,
      shopsLoaded: false,
      shops: null,
    };
  } else {
    return state;
  }
};
