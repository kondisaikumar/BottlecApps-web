export class CartGetDetailsRequestPayload {
    StoreId: number;
    DeviceId: string;
    DeviceType: string;
    UserId: number;
    SessionId: string;
    AppId: number;
    CartId: number;
    IsCredentialOff: boolean;
    CartDsp: 'Y';
    IsFromCheckOut: boolean;
    IsToCallDSP: boolean;
    DeliveryInstruction: string;
    PaymentTypeId: number;
    AddressId: number;
    OrderTypeId: number;
}
