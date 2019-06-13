import { BaseRequest } from './base-request';

export class AddressInsert extends BaseRequest  {
    AddressName: string;
    FirstName: string;
    LastName: string;
    Address1: string;
    Address2: string;
    City: string;
    State: string;
    Zip: string;
    Country: string;
    IsDefault: number;
}
