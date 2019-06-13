import { BaseRequest } from './base-request';

export class ReviewList extends BaseRequest  {
    PageSize: number;
    PageNumber: number;
    PID: number;
}
