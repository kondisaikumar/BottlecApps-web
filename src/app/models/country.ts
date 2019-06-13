import { Item } from './item';

export class Country {
    id: string;
    value: string;
    isSelected: boolean;
    regions: Item[];
}
