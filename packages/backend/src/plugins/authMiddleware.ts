import { NextFunction, Request, Response, RequestHandler } from 'express';
import { Config } from '@backstage/config';
import jwtDecode from 'jwt-decode';

export const createAuthMiddleware = (config: Config) => {
  const authMiddleware: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      let token: string = req.headers['x-atmosphere-token']?.toString() || '';
      let devToken: string | undefined;
      try {
        devToken = config
          .getOptionalConfig('oauth2-jwt-token')
          ?.getOptionalString('token');
      } catch (e) {
        // log error
      }

      if (!token && devToken) {
        token = devToken;
      }
      if (!token) {
        return res.status(401).send('Missing x-atmosphere-token in header');
      }
      if (typeof token !== 'string') {
        return res
          .status(401)
          .send(
            'Invalid x-atmosphere-token in header, x-atmosphere-token must be a string',
          );
      }
      let decoded: any;
      try {
        decoded = jwtDecode(token);
      } catch (error) {
        return res.status(401).send('Unable to decode JWT token');
      }
      if (!(decoded && decoded.email)) {
        return res.status(401).send('Invalid JWT token, missing email');
      }
      return next();
    } catch (error) {
      return res.status(401).send('Invalid authorization');
    }
  };
  return authMiddleware;
};
