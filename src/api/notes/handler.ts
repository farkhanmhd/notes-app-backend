import { Request, ResponseToolkit } from '@hapi/hapi';
import NotesService from 'src/services/inMemory/NotesService';
import NotesValidator from 'src/validator/notes';
import { INotePayload } from 'src/types/types';

export default class NotesHandler {
  private _service;

  private _validator;

  constructor(service: NotesService, validator: typeof NotesValidator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  postNoteHandler(request: Request, h: ResponseToolkit) {
    this._validator.validateNotePayload(request.payload as INotePayload);
    const { title = 'untitled', body, tags } = request.payload as INotePayload;
    const noteId = this._service.addNote({ title, body, tags });

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

  getNotesHandler() {
    const notes = this._service.getNotes();
    return {
      status: 'success',
      data: { notes },
    };
  }

  getNoteByIdHandler(request: Request) {
    const { id } = request.params;
    const note = this._service.getNoteById(id);

    return {
      status: 'success',
      data: { note },
    };
  }

  putNoteByIdHandler(request: Request) {
    this._validator.validateNotePayload(request.payload as INotePayload);
    const { id } = request.params;

    this._service.editNoteById(id, request.payload as INotePayload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  deleteNoteByIdHandler(request: Request) {
    const { id } = request.params;
    this._service.deleteNoteById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}
