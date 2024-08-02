import InvariantError from '../../exceptions/InvariantError';
import UserPayloadSchema from './schema';
import { IUser } from '../../types/types';

const UsersValidator = {
  validateUsersPayload: (payload: IUser) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default UsersValidator;
