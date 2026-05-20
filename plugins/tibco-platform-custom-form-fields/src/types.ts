/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

export interface DataplaneSummary {
  id: string;
  name: string;
}

export interface DataplaneListResponse {
  status: string;
  response: DataplaneSummary[];
  context?: string[];
}

export interface CapabilityWithStatus {
  id: string;
  name: string;
  type: string;
  capabilityStatus: string;
}

export interface DeploymentInfo {
  capabilityId: string;
  capabilityName: string;
  capabilityType: string;
  dataplaneUrl: string;
  dataplaneHost: string;
}

export interface DataplaneWithCapabilities {
  id: string;
  name: string;
  capabilities: CapabilityWithStatus[];
  deployment: DeploymentInfo;
}

export interface DataplanesWithCapabilitiesResponse {
  dataplanes: DataplaneWithCapabilities[];
}

export interface CapabilitySelectorValue {
  dataplaneId: string;
  dataplaneName: string;
  capabilityId: string;
  capabilityName: string;
  capabilityType: string;
  dataplaneUrl: string;
  dataplaneHost: string;
}
