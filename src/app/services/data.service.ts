import { ProductFilters } from '../models/product-filters';
import * as menuOptions from '../shared/store-filters.json';
import { Item } from '../models/item';

export class DataService {
    public categoryId: string;
    public searchByText: string;
    public isFeatureProduct: number;
    public filtersAllData: ProductFilters;
    public allVarietals: Item[];

    public priceRanges = [
        { 'id': '1', 'name': '$0 - $10' },
        { 'id': '2', 'name': '$10 - $25' },
        { 'id': '3', 'name': '$25 - $50' },
        { 'id': '4', 'name': '$50 - $100' },
        { 'id': '5', 'name': '$100 & Above' }
    ];

    getFiltersByCategory() {
        const allFilters = {
            size: [],
            type: [],
            price: [],
            countries: []
        };
        let filters: any;
        this.allVarietals = [];

        if (menuOptions && menuOptions['StoreFilters']) {
            filters = menuOptions['StoreFilters'];
            filters = filters.filter(item => item.CategoryId === this.categoryId)[0];
        } else {
            return;
        }

        if (!filters && !filters.ListType) {
            allFilters.type = [];
        }/*
        filters.ListType.forEach(element => {
            allFilters.type.push({ id: element.TypeId, value: element.TypeName, isSelected: false });
        });*/

        filters.ListType.forEach(type => {
            let listOfVarietals: Item[] = [];

            if (!type.ListVarietal) {
                listOfVarietals = [];
            }
            type.ListVarietal.forEach(element => {
                listOfVarietals.push({ id: element.VarietalId, value: element.VarietalName, isSelected: false });
            });
            allFilters.type.push({ id: type.TypeId, value: type.TypeName, isSelected: false, varietals: listOfVarietals });
        });

        if (allFilters && allFilters.type) {
            this.allVarietals = allFilters.type.reduce((acc, item) => [...acc, ...item.varietals], []);
        }

        if (!filters && !filters.ListSize) {
            allFilters.size = [];
        }
        filters.ListSize.forEach(element => {
            allFilters.size.push({ id: element.SizeId, value: element.UnitSize, isSelected: false });
        });

        this.priceRanges.forEach(element => {
            allFilters.price.push({ id: element.id, value: element.name, isSelected: false });
        });

        if (!filters && !filters.ListSize) {
            allFilters.size = [];
        }
        filters.ListCountries.forEach(country => {
            let listOfRegions: Item[] = [];

            if (!country.ListRegions) {
                listOfRegions = [];
            }
            country.ListRegions.forEach(element => {
                listOfRegions.push({ id: element.RegionId, value: element.RegionName, isSelected: false });
            });
            allFilters.countries.push({ id: country.CountryId, value: country.CountryName, isSelected: false, regions: listOfRegions });
        });
        this.filtersAllData = allFilters;
    }
}
