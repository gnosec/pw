import { ChangeEvent } from './change.event';

function assertReadonly(object: any, property: string, newValue: any = null): void {
  const originalValue = object[property];
  object[property] = newValue;
  expect(object[property]).toBe(originalValue);
}

describe('ChangeEvent', () => {
  describe('constructor', () => {});

  describe('previousValue', () => {
    it('should be readonly', () => {
      assertReadonly(new ChangeEvent(1, 2), 'previousValue');
    });
  });

  describe('value', () => {
    it('should be readonly', () => {
      assertReadonly(new ChangeEvent(1, 2), 'value');
    });
  });
});
