export interface ApiShop {
  id: number;
  closing_time: string;
  delivery_fee: number;
  images: {
    storeLogo: string;
    coverPhoto: string;
  };
  address: {
    line_1: string;
    line_2: string;
    postCode: string;
    county: string;
  };
  latitude: number;
  longitude: number;
  mobile_number: string;
  name: string;
  opening_time: string;
  postal_code: string;
  rating: number | null;
  shop_description: string;
  shop_type: string;
  sub_categories: number[];
  supports_delivery: boolean;
  shop_open: boolean;
  minimum_order_fee: number;
}

export interface TransformedShop {
  id: number;
  shopName: string;
  category: 'Grocery' | 'Pharmacy' | 'Butchery';
  // status: 'O' | 'C';
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  ratingsCount: number | null;
  reviewCount: number | null;
  deliveryAvailability: boolean;
  deliveryCharge: number;
  backgroundImageUrl: string;
  imageUrl: string;
  openTimings: {
    opening_time: string;
    closing_time: string;
  };
  postal_code: string;
  mobile_number: string;
  address: string;
  note?: string;
  shop_open: boolean;
  minimum_order_fee: number;
}
