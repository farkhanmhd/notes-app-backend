import { Request, ResponseToolkit } from '@hapi/hapi';
import UsersService from 'src/services/postgres/UsersService';
import UsersValidator from 'src/validator/users';
import { IUser } from 'src/types/types';

export default class UsersHandler {
  private _service;

  private _validator;

  constructor(service: UsersService, validator: typeof UsersValidator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request: Request, h: ResponseToolkit) {
    this._validator.validateUsersPayload(request.payload as IUser);
    const { username, password, fullname } = request.payload as IUser;

    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: { userId },
    });

    response.code(201);
    return response;
  }

  async getUserByIdHandler(request: Request) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: { user },
    };
  }
}