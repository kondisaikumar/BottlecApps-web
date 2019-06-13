import { BaseRequest } from './base-request';

export class CustomerProfileUpdate extends BaseRequest  {
    FirstName: string;
    LastName: string;
    EmailId: string;
    ContactNo: string;
    DOB: string;
    Gender: string;
    UserIpAddress: string;
    ProfileImage: string;
}
