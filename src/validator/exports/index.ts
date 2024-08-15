import ExportNotesPayloadSchema from './schema';
import InvariantError from '../../exceptions/InvariantError';

const ExportsValidator = {
  validateExportNotesPayload: (payload: { targetEmail: string }) => {
    const validationResult = ExportNotesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default ExportsValidator;
