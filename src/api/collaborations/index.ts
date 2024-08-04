import { Server, ServerRoute } from '@hapi/hapi';
import CollaborationsService from 'src/services/postgres/CollaborationsService';
import NotesService from 'src/services/postgres/NotesService';
import CollaborationsValidator from 'src/validator/collaborations';
import routes from './routes';
import CollaborationsHandler from './handler';

const collaborations = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      collaborationsService,
      notesService,
      validator,
    }: {
      collaborationsService: CollaborationsService;
      notesService: NotesService;
      validator: typeof CollaborationsValidator;
    }
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      notesService,
      validator
    );

    server.route(routes(collaborationsHandler) as ServerRoute[]);
  },
};

export default collaborations;
