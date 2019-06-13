import { Item } from './item';
import { Country } from './country';
import { ProductType } from './product-type';

export class ProductFilters {
    size: Item[];
    type: ProductType[];
    price: Item[];
    countries: Country[];
}
