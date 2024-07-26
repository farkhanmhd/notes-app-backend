import { Request, ResponseToolkit } from '@hapi/hapi';
import NotesService from 'src/services/inMemory/NotesService';

export default class NotesHandler {
  private _service;

  constructor(service: NotesService) {
    this._service = service;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  postNoteHandler(request: Request, h: ResponseToolkit) {
    try {
      const { title, tags, body } = request.payload as {
        title: string;
        tags: string[];
        body: string;
      };

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
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
      });
      response.code(400);
      return response;
    }
  }

  getNotesHandler() {
    const notes = this._service.getNotes();
    return {
      status: 'success',
      data: { notes },
    };
  }

  getNoteByIdHandler(request: Request, h: ResponseToolkit) {
    try {
      const { id } = request.params;
      const note = this._service.getNoteById(id);

      return {
        status: 'success',
        data: { note },
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      });

      response.code(404);
      return response;
    }
  }

  putNoteByIdHandler(request: Request, h: ResponseToolkit) {
    try {
      const { id } = request.params;

      this._service.editNoteById(
        id,
        request.payload as {
          title: string;
          tags: string[];
          body: string;
        }
      );

      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
      });

      response.code(404);
      return response;
    }
  }

  deleteNoteByIdHandler(request: Request, h: ResponseToolkit) {
    try {
      const { id } = request.params;
      this._service.deleteNoteById(id);
      return {
        status: 'success',
        message: 'Catatan berhasil dihapus',
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
      });

      response.code(404);
      return response;
    }
  }
}
