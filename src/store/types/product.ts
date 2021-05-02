export interface Product {
  productId: string;
  productName: string;
  productDesc: string;
  productUrl: string;
  price: number;
  subCategoryId: number;
  stock: number;
  isPrescriptionRequired?: boolean;
  isHalal?: boolean;
}
