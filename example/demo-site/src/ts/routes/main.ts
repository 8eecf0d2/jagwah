/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Jagwah, Route, Templates } from 'jagwah';
import { LandingTemplate, GettingStartedTemplate } from '../templates';

@Route('/')
@Templates([LandingTemplate])
export class LandingRoute {}

@Route('/getting-started')
@Templates([GettingStartedTemplate])
export class GettingStartedRoute {}
