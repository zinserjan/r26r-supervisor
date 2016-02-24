import makeDecorator from './fetch/makeDecorator';
import { PREFETCH, FETCH, DEFER } from './fetch/type';

export const prefetch = makeDecorator(PREFETCH);
export const fetch = makeDecorator(FETCH);
export const defer = makeDecorator(DEFER);
