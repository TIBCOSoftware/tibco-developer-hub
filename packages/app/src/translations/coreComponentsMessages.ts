/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

// Pre-register @backstage/core-components@0.18.x translation messages.
// plugin-scaffolder-react@1.20.0 uses core-components@0.18.x (nested) which requires
// the i18n system to have these messages. Without this, LogViewer shows raw translation
// keys like "logViewer.searchField.placeholder" instead of "Search".
export const coreComponentsMessages: {
  $$type: '@backstage/TranslationMessages';
  id: string;
  full: boolean;
  messages: Record<string, string>;
} = {
  $$type: '@backstage/TranslationMessages',
  id: 'core-components',
  full: false,
  messages: {
    'signIn.title': 'Sign In',
    'signIn.loginFailed': 'Login failed',
    'signIn.customProvider.title': 'Custom User',
    'signIn.customProvider.subtitle':
      'Enter your own User ID and credentials.\n This selection will not be stored.',
    'signIn.customProvider.userId': 'User ID',
    'signIn.customProvider.tokenInvalid':
      'Token is not a valid OpenID Connect JWT Token',
    'signIn.customProvider.continue': 'Continue',
    'signIn.customProvider.idToken': 'ID Token (optional)',
    'signIn.guestProvider.title': 'Guest',
    'signIn.guestProvider.subtitle':
      'Enter as a Guest User.\n You will not have a verified identity, meaning some features might be unavailable.',
    'signIn.guestProvider.enter': 'Enter',
    skipToContent: 'Skip to content',
    'copyTextButton.tooltipText': 'Text copied to clipboard',
    'simpleStepper.reset': 'Reset',
    'simpleStepper.finish': 'Finish',
    'simpleStepper.next': 'Next',
    'simpleStepper.skip': 'Skip',
    'simpleStepper.back': 'Back',
    'errorPage.subtitle': 'ERROR {{status}}: {{statusMessage}}',
    'errorPage.title': 'Looks like someone dropped the mic!',
    'errorPage.goBack': 'Go back',
    'errorPage.showMoreDetails': 'Show more details',
    'errorPage.showLessDetails': 'Show less details',
    'emptyState.missingAnnotation.title': 'Missing Annotation',
    'emptyState.missingAnnotation.actionTitle':
      'Add the annotation to your component YAML as shown in the highlighted example below:',
    'emptyState.missingAnnotation.readMore': 'Read more',
    'supportConfig.default.title': 'Support Not Configured',
    'supportConfig.default.linkTitle': 'Add `app.support` config key',
    'errorBoundary.title': 'Please contact {{slackChannel}} for help.',
    'oauthRequestDialog.title': 'Login Required',
    'oauthRequestDialog.authRedirectTitle':
      'This will trigger a http redirect to OAuth Login.',
    'oauthRequestDialog.login': 'Log in',
    'oauthRequestDialog.rejectAll': 'Reject All',
    'oauthRequestDialog.message':
      'Sign-in to allow {{appTitle}} access to {{provider}} APIs and identities.',
    'supportButton.title': 'Support',
    'supportButton.close': 'Close',
    'table.filter.title': 'Filters',
    'table.filter.clearAll': 'Clear all',
    'table.filter.placeholder': 'All results',
    'table.body.emptyDataSourceMessage': 'No records to display',
    'table.pagination.firstTooltip': 'First Page',
    'table.pagination.labelDisplayedRows': '{from}-{to} of {count}',
    'table.pagination.labelRowsSelect': 'rows',
    'table.pagination.lastTooltip': 'Last Page',
    'table.pagination.nextTooltip': 'Next Page',
    'table.pagination.previousTooltip': 'Previous Page',
    'table.toolbar.search': 'Filter',
    'table.header.actions': 'Actions',
    'alertDisplay.message_one': '({{ count }} newer message)',
    'alertDisplay.message_other': '({{ count }} newer messages)',
    'autoLogout.stillTherePrompt.title': 'Logging out due to inactivity',
    'autoLogout.stillTherePrompt.buttonText': "Yes! Don't log me out",
    'dependencyGraph.fullscreenTooltip': 'Toggle fullscreen',
    'proxiedSignInPage.title':
      'You do not appear to be signed in. Please try reloading the browser page.',
    'logViewer.downloadBtn.tooltip': 'Download logs',
    'logViewer.searchField.placeholder': 'Search',
  },
};
