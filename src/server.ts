import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import notes from './api/notes/index';
import NotesValidator from './validator/notes';
import ClientError from './exceptions/ClientError';
import NotesService from './services/postgres/NotesService';
import users from './api/users';
import UsersValidator from './validator/users';
import UsersService from './services/postgres/UsersService';

dotenv.config();

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  server.ext(
    'onPreResponse',
    (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      // Getting response context from request
      const { response } = request;

      // handling client error internally
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });

        newResponse.code(response.statusCode);
        return newResponse;
      }

      return h.continue;
    }
  );

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
