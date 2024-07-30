import InvariantError from '../../exceptions/InvariantError';
import NotePayloadSchema from './schema';
import { INotePayload } from '../../types/types';

const NotesValidator = {
  validateNotePayload: (payload: INotePayload) => {
    const validationResult = NotePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default NotesValidator;
