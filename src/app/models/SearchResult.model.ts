import { SearchItemModel } from './SearchItem.model';

export interface SearchResultModel {
    "Search": SearchItemModel[];
    "totalResults": string;
    "Response": string;
    "Error"?: string;
}