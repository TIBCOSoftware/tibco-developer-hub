import React from 'react';
import {
  Content,
  Page,
} from '@backstage/core-components';


export const MFTUiWrapper = () => (
  <Page themeId="tool" >
    <Content className="tpdh-home-content">
        {/*https://108.128.227.221:8443/cfcc/login/login.jsp

         */}
        <iframe src="http://localhost:7007/tibco/hub/api/proxy/mft/login/login.jsp" title="BPM UI"
          style={{ width: '100% ', height: 'calc(100%)', border: '0px', overflow: 'hidden' }}></iframe>
    </Content>
  </Page>
);
