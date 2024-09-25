import { SchedulerServiceTaskScheduleDefinitionConfig } from '@backstage/backend-plugin-api';

export interface Config {
  app?: {
    /**
     * Build information.
     * Control the display of the build information in the Homepage UI.
     */
    /**
     * Version number to display
     * @visibility frontend
     */
    buildVersion?: string | number;
    /**
     * Show build number. False by default. Has to be set explicitly as true to enable it.
     * @visibility frontend
     */
    showBuildVersion?: boolean;
    /**
     * Show developer hub version. String value. Displays currently deployed version.
     * @visibility frontend
     */
    developerHubVersion?: string;
  };
  // enable and configure loading org entities into catalog
  orgCatalog?: {
    providers?: {
      github?: {
        /**
         * A unique, stable identifier for this provider.
         */
        providerId: string;
        /**
         * (Required) Url of your org account/workspace.
         */
        orgUrl: string;
        /**
         * (Optional) SchedulerServiceTaskScheduleDefinitionConfig for the refresh.
         */
        schedule?: SchedulerServiceTaskScheduleDefinitionConfig;
      };
    };
  };
  auth?: {
    /**
     * Frontend root URL
     * @visibility frontend
     */
    enableAuthProviders: string[];
  };
  walkThrough?: {
    /**
     * Hyperlink of the external website to view all the Walk-through
     * @visibility frontend
     */
    viewAllLink: string;
    /**
     * Array of Walk-through which will be visible on the home page
     * @visibility frontend
     */
    items: {
      /**
       * Title for the Walk-through
       * @visibility frontend
       */
      title: string;
      /**
       * Array of tags for the Walk-through
       * @visibility frontend
       */
      tags: string[];
      /**
       * Description text for the Walk-through
       * @visibility frontend
       */
      text: string;
      /**
       * Hyperlink of external website for the Walk-through
       * @visibility frontend
       */
      link: string;
    }[];
  };
  /**
   * Control plane link for the TIBCO® Developer Hub
   * @visibility frontend
   */
  cpLink?: string;
  /**
   * Custom version name for the TIBCO® Developer Hub
   * @visibility frontend
   */
  tibcoDeveloperHubCustomAppVersion?: string;
  /**
   * Frontend root URL
   * @visibility frontend
   */
  catalogRefreshDelayInSec?: number;
}
