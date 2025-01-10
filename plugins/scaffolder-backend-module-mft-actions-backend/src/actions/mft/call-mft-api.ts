import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import axios from 'axios';
import { Config } from '@backstage/config';
import https from "node:https";

const DIV = '-------------------------------------------------------------------------------------------'

export interface MFTConfig {
    logger: any;
    baseUrl: string;
    username: string;
    password: string;
}


export async function callMFT(config: MFTConfig, endpoint: string, method = 'get', data?: any) {
    let mRes;

    try {
        mRes = await axios({
            method,
            url: config.baseUrl + endpoint,
            data,
            httpsAgent: new https.Agent({
                // This is because they use a self-signed certificate TODO: Remove this in production
                rejectUnauthorized: false
            }),
            auth: {
                username: config.username,
                password: config.password
            }
        })
    } catch (error: any) {
        config.logger.error('Error calling MFT API...');
        config.logger.error('Status: ' + error.status);
        if(error.response?.data) {
            let eMes = error.response.data
            if(typeof error.response.data === 'object'){
                eMes = JSON.stringify(error.response.data, null, 2);
                config.logger.error('Error Data: ' + JSON.stringify(error.response.data, null, 2));
            }
            config.logger.error('Error Data: ' + eMes);
            throw new Error(eMes);
        }

        // config.logger.error('Error:' , error);
        throw error;
    }

    if(mRes.data) {
        return mRes.data;
    } else {
        return
    }

}


export function callMftApi(config: Config) {
    // Get from config
    const mftBaseUrl = config.getString('mft.baseUrl');
    const mftUser = config.getString('mft.username');
    const mftPass = config.getString('mft.password');

    if (
        !(
            mftBaseUrl &&
            mftUser &&
            mftPass
        )
    ) {
        throw new Error(
            'Invalid configuration in app-config, missing one of the following property in mft object, baseUrl, username or password',
        );
    }

    return createTemplateAction<{
        endpoint: string;
        method?: string;
        mftInput?: any;
    }>({
        id: 'tibco:call-mft-api',
        schema: {
            input: {
                required: ['endpoint'],
                type: 'object',
                properties: {
                    endpoint: {
                        type: 'string',
                        title: 'endpoint',
                        description: 'The MFT endpoint to call',
                    },
                    method: {
                        type: 'string',
                        title: 'method',
                        description: 'method (GET, POST, PUT, DELETE) to use; default is GET',
                    },
                    mftInput: {
                        type: 'object',
                        title: 'mftInput',
                        description: 'If method is POST or PUT, this is the data to send',
                    },

                },
            },
            output: {
                required: ['mftResult'],
                type: 'object',
                properties: {
                    name: {
                        type: 'object',
                        title: 'mftResult',
                        description: 'The result from MFT',
                    },
                },
            },
        },
        async handler(ctx) {

            ctx.logger.info(DIV);
            ctx.logger.info('--- CALLING MFT API');
            ctx.logger.info(DIV);


            ctx.logger.info(`--- MFT Username: ${mftUser}`);
            ctx.logger.info(`--- MFT BASE URL: ${mftBaseUrl}`);
            ctx.logger.info(`--- MFT Endpoint: ${ctx.input.endpoint}`);
            // TODO: Add method and input data
            ctx.logger.info(`--- MFT Method: ${ctx.input.method}`);
            ctx.logger.info('--- MFT Input: \n' + JSON.stringify(ctx.input.mftInput, null, 2));

            ctx.logger.info(DIV);
            ctx.logger.info('--- Calling MFT API...');
            const mftResult = await callMFT({
                logger: ctx.logger,
                baseUrl: mftBaseUrl,
                username: mftUser,
                password: mftPass
            }, ctx.input.endpoint, ctx.input.method, ctx.input.mftInput);
            ctx.logger.info(DIV);
            ctx.logger.info('--- MFT API Result:');
            ctx.logger.info(JSON.stringify(mftResult, null, 2));
            ctx.logger.info(DIV);

            // const jenkinsJobToken = ctx.input.jobAuthToken || jenkinsJobAuthToken;
            // const repoUrl = ctx.input.repoUrl;
            // const jenkinsJob = ctx.input.job;
            // const jenkinsSecretObj = ctx.input.secret;
            // let jenkinsInstructions = ctx.input.jenkinsInstructions || '';
            //
            // ctx.logger.info(
            //     '-------------------------------------------------------------------------------------------',
            // );
            // ctx.logger.info(
            //     '------------------- STARTING THE JENKINS JOB  ---------------------------',
            // );
            // ctx.logger.info(
            //     '-------------------------------------------------------------------------------------------',
            // );
            // ctx.logger.info(`------ Jenkins BASE URL: ${jenkinsBaseUrl}`);
            // ctx.logger.info(`------ Jenkins Username: ${jenkinsUser}`);
            // ctx.logger.info(`------      Jenkins Job: ${jenkinsJob}`);
            // if (repoUrl) {
            //     ctx.logger.info(`------     Repo Name: ${repoUrl?.repo}`);
            // }
            // ctx.logger.info(`---Jenkins Instructions: ${jenkinsInstructions}`);
            // ctx.logger.info(
            //     '-------------------------------------------------------------------------------------------',
            // );
            // if (jenkinsSecretObj) {
            //     for (const sec in jenkinsSecretObj) {
            //         if (jenkinsSecretObj.hasOwnProperty(sec)) {
            //             ctx.logger.info('------ Adding secret in jenkinsInstructions ... ');
            //             const key = Buffer.from(jenkinsSecretEncryptionKey, 'hex');
            //             const iv = randomBytes(16);
            //             const encrypted = encryptSecret(key, iv, jenkinsSecretObj[sec]);
            //             jenkinsInstructions = `${jenkinsInstructions}&${sec}=${encrypted}`;
            //         }
            //     }
            // }
            // ctx.logger.info(`---Jenkins Instructions: ${jenkinsInstructions}`);
            //
            // const jenkinsCallURl = generateJenkinsCallURl(
            //     jenkinsBaseUrl,
            //     jenkinsJob,
            //     jenkinsJobToken,
            //     repoUrl,
            //     jenkinsInstructions,
            // );
            //
            // ctx.logger.info(
            //     '-------------------------------------------------------------------------------------------',
            // );
            // ctx.logger.info('---Calling Jenkins URL...');
            // ctx.logger.info(
            //     '-------------------------------------------------------------------------------------------',
            // );
            //
            // const jResponse = await axios.get(jenkinsCallURl, {
            //     auth: {
            //         username: jenkinsUser,
            //         password: jenkinsApiKey,
            //     },
            // });
            // const jobLink = `${jenkinsBaseUrl}/job/${jenkinsJob}/`;
            // ctx.logger.info(`------ Job Started: ${jResponse.statusText}`);
            // ctx.logger.info(`------    Job Link: ${jobLink}`);
            // ctx.logger.info(
            //     '------------------------------------------------------------------------------------------',
            // );
            ctx.output('mftResult', mftResult);
        },
    });
}
