import { ResponseUtilities } from '../../src/util/response-utilities';

describe('API Response Builder Tests', () => {
  const cors_headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  describe('API Response Tests', () => {
    it('should return an object with headers and a json body and default 200 status', () => {
      const string = 'hello world';

      const res = ResponseUtilities.createSuccessResponse(string);

      expect(res.statusCode).toEqual(200);
      expect(res.headers).toEqual(cors_headers);
      expect(res.body).toEqual(JSON.stringify(string));
    });

    it('should return an object with headers and a json body and given status', () => {
      const string = 'hello world';
      const status = 302;

      const res = ResponseUtilities.createSuccessResponse(string, status);

      expect(res.statusCode).toEqual(status);
      expect(res.headers).toEqual(cors_headers);
      expect(res.body).toEqual(JSON.stringify(string));
    });
  });

  describe('Error Response Tests', () => {
    it('should return an object with headers and a json body and default 200 status', () => {
      const string = 'hello world';

      const res = ResponseUtilities.createErrorResponse(string);

      expect(res.statusCode).toEqual(400);
      expect(res.headers).toEqual(cors_headers);
      expect(res.body).toEqual(JSON.stringify({ message: string }));
    });

    it('should return an object with headers and a json body and given status', () => {
      const string = 'hello world';
      const status = 500;

      const res = ResponseUtilities.createErrorResponse(string, status);

      expect(res.statusCode).toEqual(status);
      expect(res.headers).toEqual(cors_headers);
      expect(res.body).toEqual(JSON.stringify({ message: string }));
    });
  });
});
