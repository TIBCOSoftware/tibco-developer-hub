import React from 'react';
import {
  Table,
  TableColumn,
  ResponseErrorPanel,
  InfoCard,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { IconLink } from './IconLink';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import BwceSvg from './images/bwce.svg';
import FlogoSvg from './images/flogo.svg';
import DpSvg from './images/dp.svg';
import { DeploymentsEmptyState } from './DeploymentsEmptyState';

const TITLE = 'TIBCO platform application deployments';
enum AppType {
  BWCE = 'BWCE',
  FLOGO = 'FLOGO',
}

interface InputApp {
  appType: AppType;
  appName: string;
  dataPlaneName: string;
  dpId: string;
  capabilityInstanceId: string;
  appId: string;
}

interface App extends InputApp {
  appUrl: string;
  dataPlaneUrl: string;
}

type DenseTableProps = {
  apps: App[];
};
export const DenseTable = ({ apps }: DenseTableProps) => {
  const columns: TableColumn<App>[] = [
    {
      title: 'Data plane',
      field: 'dataPlaneName',
      render: data => (
        <IconLink
          href={data.dataPlaneUrl}
          text={data.dataPlaneName}
          Icon={DpSvg}
        />
      ),
    },
    {
      title: 'Application',
      field: 'appName',
      render: data => (
        <IconLink
          href={data.appUrl}
          text={data.appName}
          Icon={
            data.appType.toLocaleUpperCase() === AppType.BWCE
              ? BwceSvg
              : FlogoSvg
          }
        />
      ),
    },
  ];

  return (
    <Table
      title={TITLE}
      options={{ search: false, paging: false }}
      columns={columns}
      data={apps}
    />
  );
};

export const ApplicationDeploymentsCard = () => {
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  let cpLink = config.getOptionalString('cpLink') as string;
  if (!cpLink) {
    return <ResponseErrorPanel error={new Error('CP link not found')} />;
  }
  const pattern = /^((http|https|ftp):\/\/)/;
  if (!pattern.test(cpLink)) {
    if (cpLink.startsWith('/')) {
      cpLink = cpLink.slice(1);
    }
    cpLink = `https://${cpLink}`;
  }
  if (!cpLink.endsWith('/')) {
    cpLink += '/';
  }
  const inputApps: InputApp[] =
    (entity?.metadata?.tibcoPlatformApps as unknown as InputApp[]) || [];
  const apps: App[] = inputApps.map(app => {
    const dataPlaneUrl = `${cpLink}cp/app/data-plane?dp_id=${app.dpId}`;
    const appUrl = `${cpLink}cp/${app.appType.toLowerCase()}/appdetails?dp_id=${
      app.dpId
    }&capability_instance_id=${app.capabilityInstanceId}&app_id=${app.appId}`;
    return { ...app, dataPlaneUrl, appUrl };
  });

  return apps.length > 0 ? (
    <DenseTable apps={apps} />
  ) : (
    <InfoCard title={TITLE}>
      <DeploymentsEmptyState />
    </InfoCard>
  );
};
