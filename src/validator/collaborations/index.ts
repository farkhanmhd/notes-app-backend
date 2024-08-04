import InvariantError from '../../exceptions/InvariantError';
import CollaborationPayloadSchema from './schema';

const CollaborationsValidator = {
  validateCollaborationPayload: (payload: {
    noteId: string;
    userId: string;
  }) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default CollaborationsValidator;
