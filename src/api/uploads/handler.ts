import { Request, ResponseToolkit } from '@hapi/hapi';
import UploadsValidator from 'src/validator/uploads';
import StorageService from 'src/services/storage/StorageService';

export default class UploadsHandler {
  private _service: StorageService;

  private _validator: typeof UploadsValidator;

  constructor(service: StorageService, validator: typeof UploadsValidator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request: Request, h: ResponseToolkit) {
    const { data }: any = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);

    const response = h.response({
      status: 'success',
      data: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}
