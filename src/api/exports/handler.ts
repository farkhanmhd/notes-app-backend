import { Request, ResponseToolkit } from '@hapi/hapi';
import ProducerService from 'src/services/rabbitmq/ProducerService';
import ExportsValidator from 'src/validator/exports';

class ExportsHandler {
  private _service: typeof ProducerService;

  private _validator: typeof ExportsValidator;

  constructor(
    service: typeof ProducerService,
    validator: typeof ExportsValidator
  ) {
    this._service = service;
    this._validator = validator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(request: Request, h: ResponseToolkit) {
    this._validator.validateExportNotesPayload(
      request.payload as { targetEmail: string }
    );

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: (request.payload as { targetEmail: string }).targetEmail,
    };

    await this._service.sendMessage('export:notes', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });

    response.code(201);
    return response;
  }
}

export default ExportsHandler;
