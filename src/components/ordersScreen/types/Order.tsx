import {Address} from '../../../store/types/address';
import {CartProduct} from '../../../store/types/cartProduct';

export interface Order {
  productDetailsAreLoaded: boolean;
  address: Address;
  orderId: string;
  shopId: number;
  shopName: string;
  shopImageUrl: any;
  shopContact: string;
  estimatedDeliveryTime: string;
  deliveryCharge: number;
  totalPrice: number;
  deliveryType: string;
  note: string | null;
  products: CartProduct[];
  status: string;
}
export interface ApiOrder {
  id: string;
  customer_id: number;
  address_line: number;
  shop_id: number;
  products: string;
  delivery_type: string;
  delivery_date: string;
  amount: number;
  delivery_charge: number;
  transaction_id: number;
  status: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}
