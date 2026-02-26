/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { formatTypeDisplay } from './CardHeader';

describe('formatTypeDisplay', () => {
  describe('special cases', () => {
    it('handles artificial-intelligence with standard formatting', () => {
      expect(formatTypeDisplay('artificial-intelligence')).toBe(
        'Artificial Intelligence',
      );
    });

    it('is case sensitive for standard formatting', () => {
      expect(formatTypeDisplay('ARTIFICIAL-INTELLIGENCE')).toBe(
        'Artificial Intelligence',
      );
      expect(formatTypeDisplay('Artificial-Intelligence')).toBe(
        'Artificial Intelligence',
      );
    });
  });

  describe('standard formatting', () => {
    it('formats single words correctly', () => {
      expect(formatTypeDisplay('template')).toBe('Template');
      expect(formatTypeDisplay('document')).toBe('Document');
      expect(formatTypeDisplay('sample')).toBe('Sample');
      expect(formatTypeDisplay('widget')).toBe('Widget');
      expect(formatTypeDisplay('application')).toBe('Application');
    });

    it('formats hyphenated words correctly', () => {
      expect(formatTypeDisplay('import-flow')).toBe('Import Flow');
      expect(formatTypeDisplay('custom-integration')).toBe(
        'Custom Integration',
      );
      expect(formatTypeDisplay('multi-word-type')).toBe('Multi Word Type');
      expect(formatTypeDisplay('my-custom-app')).toBe('My Custom App');
    });

    it('handles complex hyphenated cases', () => {
      expect(formatTypeDisplay('api-gateway-template')).toBe(
        'Api Gateway Template',
      );
      expect(formatTypeDisplay('micro-service-boilerplate')).toBe(
        'Micro Service Boilerplate',
      );
      expect(formatTypeDisplay('cloud-native-app')).toBe('Cloud Native App');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for undefined input', () => {
      expect(formatTypeDisplay(undefined)).toBe('');
    });

    it('returns empty string for empty string input', () => {
      expect(formatTypeDisplay('')).toBe('');
    });

    it('returns empty string for null input', () => {
      expect(formatTypeDisplay(null as any)).toBe('');
    });

    it('handles single character input', () => {
      expect(formatTypeDisplay('a')).toBe('A');
      expect(formatTypeDisplay('x')).toBe('X');
    });

    it('handles single character with hyphen', () => {
      expect(formatTypeDisplay('a-b')).toBe('A B');
      expect(formatTypeDisplay('x-y-z')).toBe('X Y Z');
    });

    it('handles whitespace input', () => {
      expect(formatTypeDisplay('   ')).toBe('   ');
      expect(formatTypeDisplay(' template ')).toBe(' Template ');
    });
  });

  describe('numeric and special character cases', () => {
    it('handles numeric input', () => {
      expect(formatTypeDisplay('type-1')).toBe('Type 1');
      expect(formatTypeDisplay('version-2-template')).toBe(
        'Version 2 Template',
      );
      expect(formatTypeDisplay('app-v3')).toBe('App V3');
    });

    it('handles mixed alphanumeric', () => {
      expect(formatTypeDisplay('api-v2-gateway')).toBe('Api V2 Gateway');
      expect(formatTypeDisplay('service-1-template')).toBe(
        'Service 1 Template',
      );
    });

    it('only replaces hyphens, not other special characters', () => {
      expect(formatTypeDisplay('type_with_underscores')).toBe(
        'Type_with_underscores',
      );
      expect(formatTypeDisplay('type.with.dots')).toBe('Type.with.dots');
      expect(formatTypeDisplay('type with spaces')).toBe('Type With Spaces');
    });
  });

  describe('real-world examples', () => {
    it('handles common marketplace types', () => {
      expect(formatTypeDisplay('template')).toBe('Template');
      expect(formatTypeDisplay('document')).toBe('Document');
      expect(formatTypeDisplay('sample')).toBe('Sample');
      expect(formatTypeDisplay('import-flow')).toBe('Import Flow');
      expect(formatTypeDisplay('artificial-intelligence')).toBe(
        'Artificial Intelligence',
      );
    });

    it('handles custom integration types', () => {
      expect(formatTypeDisplay('rest-api')).toBe('Rest Api');
      expect(formatTypeDisplay('kafka-connector')).toBe('Kafka Connector');
      expect(formatTypeDisplay('database-adapter')).toBe('Database Adapter');
      expect(formatTypeDisplay('message-queue')).toBe('Message Queue');
    });

    it('handles business process types', () => {
      expect(formatTypeDisplay('business-process')).toBe('Business Process');
      expect(formatTypeDisplay('workflow-template')).toBe('Workflow Template');
      expect(formatTypeDisplay('decision-service')).toBe('Decision Service');
      expect(formatTypeDisplay('rule-engine')).toBe('Rule Engine');
    });
  });
});
