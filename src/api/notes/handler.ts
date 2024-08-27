import { Request, ResponseToolkit } from '@hapi/hapi';
import NotesService from 'src/services/postgres/NotesService';
import NotesValidator from 'src/validator/notes';
import { INotePayload } from 'src/types/types';

export default class NotesHandler {
  private _service: NotesService;

  private _validator: typeof NotesValidator;

  constructor(service: NotesService, validator: typeof NotesValidator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(request: Request, h: ResponseToolkit) {
    this._validator.validateNotePayload(request.payload as INotePayload);
    const { title = 'untitled', body, tags } = request.payload as INotePayload;
    const { id: credentialId } = request.auth.credentials as { id: string };
    const noteId = await this._service.addNote({
      title,
      body,
      tags,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });

    response.code(201);
    return response;
  }

  async getNotesHandler(request: Request) {
    const { id: credentialId } = request.auth.credentials as { id: string };
    const notes = await this._service.getNotes(credentialId);
    return {
      status: 'success',
      data: { notes },
    };
  }

  async getNoteByIdHandler(request: Request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials as { id: string };

    await this._service.verifyNoteAccess(id, credentialId);
    const note = await this._service.getNoteById(id);

    return {
      status: 'success',
      data: { note },
    };
  }

  async putNoteByIdHandler(request: Request) {
    this._validator.validateNotePayload(request.payload as INotePayload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials as { id: string };

    await this._service.verifyNoteAccess(id, credentialId);
    await this._service.editNoteById(id, request.payload as INotePayload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteNoteByIdHandler(request: Request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials as { id: string };

    await this._service.verifyNoteOwner(id, credentialId);
    await this._service.deleteNoteById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}
