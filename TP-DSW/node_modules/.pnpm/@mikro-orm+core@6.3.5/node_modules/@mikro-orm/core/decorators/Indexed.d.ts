import type { AnyEntity, Dictionary } from '../typings';
import type { DeferMode } from '../enums';
export declare function Index<T>(options?: IndexOptions<T>): (target: AnyEntity, propertyName?: string) => any;
export declare function Unique<T>(options?: UniqueOptions<T>): (target: AnyEntity, propertyName?: string) => any;
interface BaseOptions<T> {
    name?: string;
    properties?: keyof T | (keyof T)[];
    options?: Dictionary;
    expression?: string;
}
export interface UniqueOptions<T> extends BaseOptions<T> {
    deferMode?: DeferMode | `${DeferMode}`;
}
export interface IndexOptions<T> extends BaseOptions<T> {
    type?: string;
}
export {};
