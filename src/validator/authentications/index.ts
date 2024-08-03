import { IAuthPayload } from 'src/types/types';
import {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} from './schema';
import InvariantError from '../../exceptions/InvariantError';

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload: IAuthPayload) => {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload: { refreshToken: string }) => {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload: { refreshToken: string }) => {
    const validationResult =
      DeleteAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default AuthenticationsValidator;
