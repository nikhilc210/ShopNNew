import {Address} from '../../types/address';

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  mobile_no: string;
  imgUrl: string;
  address: Address[];
}
