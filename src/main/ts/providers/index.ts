/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

import { SyncProvider as _syncProvider } from './sync';
import { HttpProvider as _httpProvider } from './http';

export module Providers {
	export type SyncProvider = _syncProvider;
	export const SyncProvider = _syncProvider;
	export type HttpProvider = _httpProvider;
	export const HttpProvider = _httpProvider;
}
