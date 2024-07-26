import Hapi from '@hapi/hapi';
import NotesService from './services/inMemory/NotesService';
import notes from './api/notes/index';

const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    port: 3000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
