import {TransformedShop} from './shop';
import {CartProduct} from './cartProduct';

export interface CartState {
  address: number;
  // Shop Id
  shops: {
    [shopId: number]: {
      shopDetails: TransformedShop;
      note: string;
      deliveryType: string;
      deliveryCharge: string;
      // Product Id
      products: {
        [productId: number]: CartProduct;
      };
    };
  };
}
