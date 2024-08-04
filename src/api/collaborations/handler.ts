import { Request, ResponseToolkit } from '@hapi/hapi';
import CollaborationsService from 'src/services/postgres/CollaborationsService';
import NotesService from 'src/services/postgres/NotesService';
import CollaborationsValidator from 'src/validator/collaborations';

export default class CollaborationsHandler {
  private _collaborationsService: CollaborationsService;

  private _notesService: NotesService;

  private _validator: typeof CollaborationsValidator;

  constructor(
    collaborationsService: CollaborationsService,
    notesService: NotesService,
    validator: typeof CollaborationsValidator
  ) {
    this._collaborationsService = collaborationsService;
    this._notesService = notesService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request: Request, h: ResponseToolkit) {
    this._validator.validateCollaborationPayload(
      request.payload as { noteId: string; userId: string }
    );

    const { id: credentialId } = request.auth.credentials as { id: string };
    const { noteId, userId } = request.payload as {
      noteId: string;
      userId: string;
    };

    await this._notesService.verifyNoteOwner(noteId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(
      noteId,
      userId
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request: Request) {
    this._validator.validateCollaborationPayload(
      request.payload as { noteId: string; userId: string }
    );

    const { id: credentialId } = request.auth.credentials as { id: string };
    const { noteId, userId } = request.payload as {
      noteId: string;
      userId: string;
    };

    await this._notesService.verifyNoteOwner(noteId, credentialId);
    await this._collaborationsService.deleteCollaboration(noteId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}
