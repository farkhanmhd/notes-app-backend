import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import dotenv from 'dotenv';
import ClientError from './exceptions/ClientError';
import notes from './api/notes/index';
import NotesValidator from './validator/notes';
import NotesService from './services/postgres/NotesService';
import users from './api/users';
import UsersValidator from './validator/users';
import UsersService from './services/postgres/UsersService';
import authentications from './api/authentications';
import AuthenticationsService from './services/postgres/AuthenticationsService';
import AuthenticationsValidator from './validator/authentications';
import TokenManager from './tokenize/TokenManager';

dotenv.config();

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

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
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts: { decoded: { payload: { id: string } } }) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
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
