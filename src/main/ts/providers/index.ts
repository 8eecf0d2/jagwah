/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

import { SyncProvider as _syncProvider } from './sync';

export module Providers {
	export type SyncProvider = _syncProvider;
	export const SyncProvider = _syncProvider;
}