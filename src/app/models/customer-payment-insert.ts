import { BaseRequest } from './base-request';

export class CustomerPaymentInsert extends BaseRequest  {
    UserProfileId: string;
    IsDefault: boolean;
    IsCardDefault: boolean;
    PaymentTypeId: number;
}
