import { BaseRequest } from './base-request';

export class AddProductReview extends BaseRequest  {
    ReviewTitle: string;
    ReviewDescription: string;
    ReviewRating: number;
    PID: number;
}
