/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableColumn,
  ResponseErrorPanel,
  InfoCard,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { IconLink } from './IconLink';
import { ErrorMessage } from './ErrorMessage';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import BwceSvg from './images/bwce.svg';
import FlogoSvg from './images/flogo.svg';
import DpSvg from './images/dp.svg';
import CpSvg from './images/cp.svg';
import { DeploymentsEmptyState } from './DeploymentsEmptyState';
import Alert from '@material-ui/lab/Alert';

const TITLE = 'TIBCO platform application deployments';
enum AppType {
  BWCE = 'BWCE',
  FLOGO = 'FLOGO',
}
interface SecondaryControlPlanes {
  name: string;
  url: string;
  id?: string;
}
interface InputApp {
  id?: number;
  appType: AppType;
  appName: string;
  dataPlaneName: string;
  dpId: string;
  capabilityInstanceId: string;
  appId: string;
  controlPlaneName?: string;
  controlPlaneUrl?: string;
  controlPlaneId?: string;
}

interface App extends InputApp {
  appUrl?: string;
  dataPlaneUrl?: string;
  invalidControlPlaneId?: string;
}

type DenseTableProps = {
  apps: App[];
  cpColumnExist: boolean;
};
export const DenseTable = ({ apps, cpColumnExist }: DenseTableProps) => {
  const columns: TableColumn<App>[] = [];
  if (cpColumnExist) {
    columns.push({
      title: 'Control plane',
      field: 'controlPlaneName',
      render: data =>
        data.invalidControlPlaneId ? (
          <ErrorMessage
            text={`Invalid controlPlaneId '${data.invalidControlPlaneId}' in configuration`}
          />
        ) : (
          <IconLink
            href={data.controlPlaneUrl || ''}
            text={data.controlPlaneName}
            Icon={CpSvg}
          />
        ),
    });
  }
  columns.push({
    title: 'Data plane',
    field: 'dataPlaneName',
    render: data =>
      data.invalidControlPlaneId ? (
        ''
      ) : (
        <IconLink
          href={data.dataPlaneUrl || ''}
          text={data.dataPlaneName}
          Icon={DpSvg}
        />
      ),
  });
  columns.push({
    title: 'Application',
    field: 'appName',
    render: data =>
      data.invalidControlPlaneId ? (
        ''
      ) : (
        <IconLink
          href={data.appUrl || ''}
          text={data.appName}
          Icon={
            data.appType.toLocaleUpperCase() === AppType.BWCE
              ? BwceSvg
              : FlogoSvg
          }
        />
      ),
  });
  return (
    <Table
      title={TITLE}
      options={{ search: false, paging: false }}
      columns={columns}
      data={apps}
    />
  );
};
const secondaryControlPlanesValue = (
  secondaryControlPlanes: SecondaryControlPlanes[] | undefined,
) => {
  const out: SecondaryControlPlanes[] = [];
  if (!secondaryControlPlanes || !Array.isArray(secondaryControlPlanes)) {
    return undefined;
  }
  for (const secondaryControlPlane of secondaryControlPlanes) {
    if (
      !secondaryControlPlane.name ||
      typeof secondaryControlPlane.name !== 'string' ||
      !secondaryControlPlane.url ||
      typeof secondaryControlPlane.url !== 'string'
    ) {
      continue;
    }
    out.push(secondaryControlPlane);
  }
  return out;
};

const getCpFromConfig = (
  secondaryControlPlanes: SecondaryControlPlanes[],
  cpId: string,
): SecondaryControlPlanes | null => {
  for (const cp of secondaryControlPlanes) {
    if (cp.id === cpId) {
      return cp;
    }
  }
  return null;
};

const constructCpUrl = (cpLink: string): string => {
  let outCpLink = cpLink;
  const pattern = /^((http|https|ftp):\/\/)/;
  if (!pattern.test(outCpLink)) {
    if (outCpLink.startsWith('/')) {
      outCpLink = outCpLink.slice(1);
    }
    outCpLink = `https://${outCpLink}`;
  }
  if (!outCpLink.endsWith('/')) {
    outCpLink += '/';
  }
  return outCpLink;
};
export const ApplicationDeploymentsError = () => {
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const inputApps: InputApp[] =
    (entity?.metadata?.tibcoPlatformApps as unknown as InputApp[]) || [];
  const errors: string[] = [];
  const secondaryControlPlanes: SecondaryControlPlanes[] =
    secondaryControlPlanesValue(config.getOptional('secondaryControlPlanes')) ||
    [];
  for (const app of inputApps) {
    if (app.controlPlaneId) {
      const cpln = getCpFromConfig(secondaryControlPlanes, app.controlPlaneId);
      if (!cpln && (!app.controlPlaneName || !app.controlPlaneUrl)) {
        errors.push(app.controlPlaneId);
      }
    }
  }
  if (errors.length > 0) {
    return (
      <>
        <Alert severity="error" style={{ whiteSpace: 'pre-line' }}>
          <div>This entity has configuration issue in tibcoPlatformApps</div>
          {errors.map((error, i) => (
            <div key={i}>Invalid controlPlaneId '{error}'</div>
          ))}
        </Alert>
      </>
    );
  }
  return null;
};

export const ApplicationDeploymentsCard = () => {
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const [records, setRecords] = useState<App[]>([]);
  const [cpColumn, setCpColumn] = useState<boolean>(false);
  const cpUrl = config.getOptionalString('cpLink') as string;
  useEffect(
    () => {
      let cpLink = cpUrl;
      if (!cpLink) {
        return;
      }
      cpLink = constructCpUrl(cpLink);
      const inputApps: InputApp[] =
        (entity?.metadata?.tibcoPlatformApps as unknown as InputApp[]) || [];
      const secondaryControlPlanes: SecondaryControlPlanes[] =
        secondaryControlPlanesValue(
          config.getOptional('secondaryControlPlanes'),
        ) || [];
      const apps: App[] = [];
      let cpColumnExist = false;
      let id = 1;
      for (const app of inputApps) {
        let appCpUrl = null;
        if (app.controlPlaneId) {
          const cpln = getCpFromConfig(
            secondaryControlPlanes,
            app.controlPlaneId,
          );
          if (cpln) {
            appCpUrl = cpln.url;
            app.controlPlaneUrl = appCpUrl;
            app.controlPlaneName = cpln.name;
            cpColumnExist = true;
          } else if (!app.controlPlaneName || !app.controlPlaneUrl) {
            continue;
          }
        }
        if (!appCpUrl && app.controlPlaneName && app.controlPlaneUrl) {
          appCpUrl = app.controlPlaneUrl;
          cpColumnExist = true;
        }
        if (!appCpUrl) {
          appCpUrl = cpLink;
          app.controlPlaneUrl = appCpUrl;
          app.controlPlaneName = 'Primary Control Plane';
        }
        appCpUrl = constructCpUrl(appCpUrl);
        const dataPlaneUrl = `${appCpUrl}cp/app/data-plane?dp_id=${app.dpId}`;
        const appUrl = `${appCpUrl}cp/${app.appType.toLowerCase()}/appdetails?dp_id=${
          app.dpId
        }&capability_instance_id=${app.capabilityInstanceId}&app_id=${
          app.appId
        }`;
        app.id = id;
        apps.push({ ...app, dataPlaneUrl, appUrl });
        id++;
      }
      setRecords(apps);
      setCpColumn(cpColumnExist);
    },
    /* eslint-disable */ [],
  );
  if (!cpUrl) {
    return <ResponseErrorPanel error={new Error('CP link not found')} />;
  }

  return records.length > 0 ? (
    <DenseTable apps={records} cpColumnExist={cpColumn} />
  ) : (
    <InfoCard title={TITLE}>
      <DeploymentsEmptyState />
    </InfoCard>
  );
};
