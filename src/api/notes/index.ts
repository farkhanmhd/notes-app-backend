import { Server, ServerRoute } from '@hapi/hapi';
import NotesService from 'src/services/inMemory/NotesService';
import NotesValidator from 'src/validator/notes';
import NotesHandler from './handler';
import routes from './routes';

const notes = {
  name: 'notes',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      service,
      validator,
    }: { service: NotesService; validator: typeof NotesValidator }
  ) => {
    const notesHandler = new NotesHandler(service, validator);
    server.route(routes(notesHandler) as ServerRoute[]);
  },
};

export default notes;
