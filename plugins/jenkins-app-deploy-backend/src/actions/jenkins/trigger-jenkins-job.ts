import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import axios from 'axios';
import { Config } from '@backstage/config';
import { encryptSecret } from './encryption';
import {randomBytes} from 'crypto';

export function triggerJenkinsJobAction(config: Config){
  // Get from config
  const jenkinsBaseUrl = config.getString('jenkins.baseUrl');
  const jenkinsUser = config.getString('jenkins.username');
  const jenkinsApiKey = config.getString('jenkins.apiKey');
  const jenkinsJobAuthToken = config.getString('jenkins.jenkinsActionJobAuthToken');
  const jenkinsSecretEncryptionKey = config.getString(
    'jenkins.jenkinsActionSecretEncryptionKey'
  );
  if(!(jenkinsBaseUrl && jenkinsUser && jenkinsApiKey && jenkinsJobAuthToken && jenkinsSecretEncryptionKey)){
    throw new Error('Invalid configuration in app-config, missing one of the following property in jenkins object, baseUrl, username, apiKey, jenkinsActionJobAuthToken or jenkinsActionSecretEncryptionKey');
  }

  return createTemplateAction<{
    repoUrl: {host: string; owner: string; repo: string};
    job: string;
    jobAuthToken?: string;
    secret: { [key: string]: string; };
    jenkinsInstructions?: string;
  }>({
    id: 'tibco:jenkins-trigger-ear-build',
    schema: {
      input: {
        required: ['repoUrl', 'job', 'secret' ],
        type: 'object',
        properties: {
          repoUrl: {
            type: 'object',
            title: 'repo url',
            description: 'The repo url',
          },
          job: {
            type: 'string',
            title: 'job',
            description: 'The Jenkins Job to run',
          },
          jobAuthToken: {
            type: 'string',
            title: 'job authentication token',
            description: 'The authentication token needed to construct URL and trigger build remotely:',
          },
          secret: {
            type: 'object',
            title: 'secret',
            description: 'Secrets to pass into the Jenkins Job',
          },
          jenkinsInstructions: {
            type: 'string',
            title: 'jenkinsInstructions',
            description: 'Jenkins Parameters',
          },
        },
      },
      output: {
        required: ['jobLink'],
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'jobLink',
            description: 'The link to the Jenkins Job',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info(`Jenkins BASE URL: ${jenkinsBaseUrl}`);
      ctx.logger.info(`Jenkins Username: ${jenkinsUser}`);
      const jenkinsJobToken = ctx.input.jobAuthToken || jenkinsJobAuthToken;
      const repoUrl = ctx.input.repoUrl;
      const jenkinsJob = ctx.input.job;
      const jenkinsSecretObj = ctx.input.secret;
      let jenkinsInstructions = ctx.input.jenkinsInstructions || '';

      ctx.logger.info(
        '-------------------------------------------------------------------------------------------',
      );
      ctx.logger.info(
        '------------------- STARTING JENKINS JOB TO BUILD THE EAR FILE  ---------------------------',
      );
      ctx.logger.info(
        '-------------------------------------------------------------------------------------------',
      );
      ctx.logger.info(`------ Jenkins BASE URL: ${jenkinsBaseUrl}`);
      ctx.logger.info(`------ Jenkins Username: ${jenkinsUser}`);
      ctx.logger.info(`------      Jenkins Job: ${jenkinsJob}`);
      ctx.logger.info(`------     Repo Name: ${repoUrl.repo}`);
      ctx.logger.info(`---Jenkins Instructions: ${jenkinsInstructions}`);
      ctx.logger.info(
        '-------------------------------------------------------------------------------------------',
      );
      if(jenkinsSecretObj){
        for (const sec in jenkinsSecretObj){
          if(jenkinsSecretObj.hasOwnProperty(sec)){
            ctx.logger.info(
              '------ Adding secret in jenkinsInstructions ... ',
            );
            const key = Buffer.from(jenkinsSecretEncryptionKey, 'hex');
            const iv = randomBytes(16);
            const encrypted = encryptSecret(key, iv, jenkinsSecretObj[sec]);
            jenkinsInstructions = `${jenkinsInstructions }&${ sec  }=${ encrypted}`;
          }
        }
      }
      ctx.logger.info(`---Jenkins Instructions: ${  jenkinsInstructions}`);

      const jenkinsCallURl = `${jenkinsBaseUrl}/job/${jenkinsJob}/buildWithParameters?token=${jenkinsJobToken}&repo_host=${repoUrl.host}&repo_owner=${repoUrl.owner}&repo_name=${repoUrl.repo}${jenkinsInstructions}`;
      ctx.logger.info(
        '-------------------------------------------------------------------------------------------',
      );
      ctx.logger.info('---Calling Jenkins URL...');
      ctx.logger.info(
        '-------------------------------------------------------------------------------------------',
      );

      const jResponse = await axios.get(jenkinsCallURl, {
        auth: {
          username: jenkinsUser,
          password: jenkinsApiKey,
        },
      });
      const jobLink = `${jenkinsBaseUrl}/job/${jenkinsJob}/`;
      ctx.logger.info(`------ Job Started: ${jResponse.statusText}`);
      ctx.logger.info(`------    Job Link: ${jobLink}`);
      ctx.logger.info(
        '------------------------------------------------------------------------------------------',
      );
      ctx.output('jobLink', jobLink);
    },
  });
}
