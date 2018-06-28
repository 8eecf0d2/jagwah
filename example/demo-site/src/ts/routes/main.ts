/*
 * 8eecf0d2/hyperbole - 2018
 */

import { Hyperbole, Route, Templates } from 'hyperbole';
import { LandingTemplate, GettingStartedTemplate } from '../templates';

@Route('/')
@Templates([LandingTemplate])
export class LandingRoute {}

@Route('/getting-started')
@Templates([GettingStartedTemplate])
export class GettingStartedRoute {}
