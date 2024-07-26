import InvariantError from '../../exceptions/InvariantError';
import NotePayloadSchema from './schema';

const NotesValidator = {
  validateNotePayload: (payload: {
    title: string;
    body: string;
    tags: string[];
  }) => {
    const validationResult = NotePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default NotesValidator;
