export interface Config {
  jenkins: {
    /**
     * Default instance baseUrl, can be specified on a named instance called "default"
     */
    baseUrl: string;
    /**
     * Default instance username, can be specified on a named instance called "default"
     */
    username: string;
    /**
     * Default Instance apiKey, can be specified on a named instance called "default"
     * @visibility secret
     */
    apiKey: string;
    /**
     * Secret encryption key, which will be used to encrypt the secret
     */
    jenkinsActionSecretEncryptionKey: string;
    /**
     * Authentication Token to trigger builds remotely, should be set while configuring jenkins project under 'Build Triggers'
     */
    jenkinsActionJobAuthToken: string;
  };
}
