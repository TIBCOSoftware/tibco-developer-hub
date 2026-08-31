/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

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
    /**
     * Documentation url. String value.
     * @visibility frontend
     */
    docUrl: string;
  };
  auth?: {
    /**
     * Frontend root URL
     * @visibility frontend
     */
    enableAuthProviders: string[];
  };
  /**
   * Secondary control planes configuration
   * @visibility frontend
   */
  secondaryControlPlanes?: {
    /**
     * Name of the control plane
     * @visibility frontend
     */
    name?: string;
    /**
     * Url of the control plane
     * @visibility frontend
     */
    url?: string;
    /**
     * Id of the control plane
     * @visibility frontend
     */
    id?: string;
  }[];
  /**
   * Template groups configuration
   * @visibility frontend
   */
  templateGroups?: {
    /**
     * Name of the group
     * @visibility frontend
     */
    name?: string;
    /**
     * Tags in array
     * @visibility frontend
     */
    tagFilters?: string[];
  }[];
  /**
   * Importflow groups configuration
   * @visibility frontend
   */
  importFlowGroups?: {
    /**
     * Name of the group
     * @visibility frontend
     */
    name?: string;
    /**
     * Tags in array
     * @visibility frontend
     */
    tagFilters?: string[];
  }[];
  /**
   * Marketplace groups configuration
   * @visibility frontend
   */
  marketplaceGroups?: {
    /**
     * Name of the group
     * @visibility frontend
     */
    name: string;
    /**
     * Tags in array
     * @visibility frontend
     */
    tagFilters: string[];
  }[];
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
   * Configuration for adding essential locations to catalog on app start up in backend
   */
  essentialLocations?: {
    /**
     * Locations to be added in catalog as essential locations
     */
    locations?: {
      type?: string;
      target: string;
    }[];
    /**
     * Run the scheduler which checks and add essential locations in an interval
     */
    runScheduler?: boolean;
    /**
     * Frequency of the scheduler job in minutes
     */
    frequencyInMinutes?: number;
  };
  /**
   * Custom configurations
   */
  tibco?: {
    /**
     * Enable or disable MCP actions
     */
    mcpActions?: {
      enabled?: boolean;
    };
    /**
     * CP MCP Hub link configuration for the MCP Catalog page
     */
    mcpHub?: {
      /**
       * Show the CP MCP Hub button. Defaults to true when `mcpHub` is
       * configured; set to false to hide the button.
       * @visibility frontend
       */
      enabled?: boolean;
      /**
       * Base URL of the CP MCP Hub. Falls back to `cpLink` when not set.
       * @visibility frontend
       */
      baseUrl?: string;
      /**
       * Path appended to the base URL to build the CP MCP Hub link.
       * @visibility frontend
       */
      path?: string;
    };
  };
}
