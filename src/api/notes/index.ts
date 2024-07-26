import { Server, ServerRoute } from '@hapi/hapi';
import NotesService from 'src/services/inMemory/NotesService';
import NotesHandler from './handler';
import routes from './routes';

const notes = {
  name: 'notes',
  version: '1.0.0',
  register: async (server: Server, { service }: { service: NotesService }) => {
    const notesHandler = new NotesHandler(service);
    server.route(routes(notesHandler) as ServerRoute[]);
  },
};

export default notes;
