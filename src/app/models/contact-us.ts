import { BaseRequest } from './base-request';

export class ContactUs extends BaseRequest  {
    ContactUsEmail: string;
    Subject: string;
    Message: string;
    Phone: string;
    Name: string;
}
