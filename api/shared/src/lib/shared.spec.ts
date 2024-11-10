import { verify_password, verify_email, delete_xss, verify_name } from './shared';

describe('Utils Functions', () => {

  describe('verify_password', () => {
    it('should return true for a password longer than 3 characters', () => {
      expect(verify_password('abcd')).toBe(true);
    });

    it('should return false for a password of 3 characters or less', () => {
      expect(verify_password('abc')).toBe(false);
      expect(verify_password('')).toBe(false);
    });
  });

  describe('verify_email', () => {
    it('should return true for a valid email', () => {
      expect(verify_email('test@example.com')).toBe(true);
    });

    it('should return false for an invalid email', () => {
      expect(verify_email('invalid-email')).toBe(false);
      expect(verify_email('user@.com')).toBe(false);
      expect(verify_email('user@domain')).toBe(false);
      expect(verify_email('user.name+alias@domain.co')).toBe(false);
    });
  });

  describe('verify_name', () => {
    it('should return true for a valid name', () => {
      expect(verify_name("Valid")).toBe(true);
    });

    it('should return false for an invalid name', () => {
      expect(verify_name("Invalid Name")).toBe(false);
      expect(verify_name("La+-5")).toBe(false);
    });
  });

  describe('delete_xss', () => {
    it('should remove angle brackets from the input string', () => {
      expect(delete_xss('<script>alert("XSS")</script>')).toBe('scriptalert("XSS")/script');
    });

    it('should return the original string if there are no angle brackets', () => {
      expect(delete_xss('No angle brackets')).toBe('No angle brackets');
    });
  });
});
