// eslint-disable @typescript-eslint/no-unused-vars
import {
  CART_ADD_PRODUCT,
  CART_CLEAR,
  CART_ADD_SHOP,
  CART_REMOVE_PRODUCT,
  CART_REMOVE_SHOP,
  CART_ADD_NOTE,
  CART_CHANGE_DELIVERY_TYPE,
} from './actions';
import {CartState} from '../../types/CartState';
import {TransformedShop} from '../../types/shop';
import {CartProduct} from '../../types/cartProduct';

export const cartReducer = (
  state: CartState = {
    address: 0,
    shops: {},
  },
  {
    type,
    product: productDetails,
  }: {
    type: String;
    product: {
      shopDetails: TransformedShop;
      product?: CartProduct;
      note?: string;
    };
  },
) => {
  if (type === CART_ADD_SHOP) {
    const {shopDetails, product} = productDetails;
    return {
      ...state,
      shops: {
        ...state?.shops,
        [shopDetails.id]: {
          shopDetails,
          products: {
            [product.productId]: product,
          },
          note: '',
          deliveryType:
            shopDetails.category === 'Pharmacy'
              ? 'C'
              : shopDetails.deliveryAvailability
              ? 'D'
              : 'C',
          deliveryCharge: shopDetails.deliveryCharge,
        },
      },
    };
  } else if (type === CART_ADD_PRODUCT) {
    const {shopDetails, product} = productDetails;
    return {
      ...state,
      shops: {
        ...state?.shops,
        [shopDetails.id]: {
          ...state?.shops[shopDetails.id],
          products: {
            ...state?.shops[shopDetails.id].products,
            [product.productId]: product,
          },
        },
      },
    };
  } else if (type === CART_REMOVE_PRODUCT) {
    const {shopDetails, product} = productDetails;
    delete state.shops[shopDetails.id].products[product.productId];
    if (Object.keys(state.shops[shopDetails.id].products).length === 0) {
      delete state.shops[shopDetails.id];
    }
    return {
      ...state,
    };
  } else if (type === CART_REMOVE_SHOP) {
    const {shopDetails} = productDetails;
    delete state.shops[shopDetails.id];
    return {
      ...state,
    };
  } else if (type === CART_ADD_NOTE) {
    const {shopDetails} = productDetails;
    return {
      ...state,
      shops: {
        ...state.shops,
        [productDetails.shopDetails.id]: {
          ...state.shops[productDetails.shopDetails.id],
          note: shopDetails.note,
        },
      },
    };
  } else if (type === CART_CHANGE_DELIVERY_TYPE) {
    const {shopDetails} = productDetails;
    return {
      ...state,
      shops: {
        ...state.shops,
        [shopDetails.id]: {
          ...state.shops[shopDetails.id],
          deliveryType:
            state.shops[shopDetails.id].deliveryType === 'C' ? 'D' : 'C',
        },
      },
    };
  } else if (type === CART_CLEAR) {
    // console.log('Clearing cart');
    return {
      ...state,
      shops: {},
    };
  } else {
    return state;
  }
};
