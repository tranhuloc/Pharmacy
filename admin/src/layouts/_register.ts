import type { App } from 'vue';
import TheAdminLayout from './TheAdminLayout.vue'

/**
 * Register layouts in the app instance
 *
 * @param {App<Element>} app
 */
export function registerLayouts(app: App<Element>) {
  app.component("TheAdminLayout", TheAdminLayout);
}