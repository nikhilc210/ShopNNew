//Cart Actions
import {TransformedShop} from '../../types/shop';
import {CartProduct} from '../../types/cartProduct';
import {Order} from '../../../components/ordersScreen/types/Order';

export const CART_ADD_SHOP = 'CART_ADD_SHOP';
export const CART_REMOVE_SHOP = 'CART_REMOVE_SHOP';
export const CART_ADD_PRODUCT = 'CART_ADD_PRODUCT';
export const CART_REMOVE_PRODUCT = 'CART_REMOVE_PRODUCT';
export const CART_ADD_NOTE = 'CART_ADD_NOTE';
export const CART_CHANGE_DELIVERY_TYPE = 'CART_CHANGE_DELIVERY_TYPE';
export const CART_CLEAR = 'CART_CLEAR';

export function addProduct(productDetails: {
  shopDetails: TransformedShop;
  product: CartProduct;
}) {
  return (dispatch, getState) => {
    const cartState = getState().cart;
    if (
      Object.keys(cartState.shops).find(
        (shopId) => shopId === productDetails.shopDetails.id.toString(),
      )
    ) {
      return dispatch({
        type: CART_ADD_PRODUCT,
        product: productDetails,
      });
    } else {
      return dispatch({
        type: CART_ADD_SHOP,
        product: productDetails,
      });
    }
  };
}

export function removeProduct(productDetails) {
  return (dispatch, getState) => {
    const cartState = getState().cart;
    if (
      Object.keys(cartState.shops).find(
        (shopId) => shopId === productDetails.shopDetails.id.toString(),
      )
    ) {
      if (
        Object.keys(cartState.shops[productDetails.shopDetails.id.toString()])
          .length === 1
      ) {
        return dispatch({
          type: CART_REMOVE_SHOP,
          product: productDetails,
        });
      }
      return dispatch({
        type: CART_REMOVE_PRODUCT,
        product: productDetails,
      });
    }
  };
}

export function removeShop(productDetails: {shopDetails: TransformedShop}) {
  return (dispatch, getState) => {
    const cartState = getState().cart;
    if (
      Object.keys(cartState.shops).find(
        (shopId) => shopId === productDetails.shopDetails.id.toString(),
      )
    ) {
      return dispatch({
        type: CART_REMOVE_SHOP,
        product: productDetails,
      });
    }
  };
}

export function addNote(productDetails: {shopDetails: TransformedShop}) {
  return (dispatch, getState) => {
    const cartState = getState().cart;
    if (
      Object.keys(cartState.shops).find(
        (shopId) => shopId === productDetails.shopDetails.id.toString(),
      )
    ) {
      return dispatch({
        type: CART_ADD_NOTE,
        product: productDetails,
      });
    }
  };
}

export function changeDeliveryType(productDetails: {
  shopDetails: TransformedShop;
}) {
  return (dispatch, getState) => {
    const cartState = getState().cart;
    if (
      Object.keys(cartState.shops).find(
        (shopId) => shopId === productDetails.shopDetails.id.toString(),
      )
    ) {
      return dispatch({
        type: CART_CHANGE_DELIVERY_TYPE,
        product: productDetails,
      });
    }
  };
}

export function copyOrder(order: Order, shop: TransformedShop) {
  return (dispatch, getState) => {
    const cartState = getState().cart;
    // console.log('***************************');
    // console.log(shop, cartState);
  };
  // console.log(order);
}

export function clearCart() {
  // console.log('Inside the clear cart function');
  return (dispatch, getState) => {
    // console.log('Dispatching CART_CLEAR');
    return dispatch({
      type: CART_CLEAR,
    });
  };
}
