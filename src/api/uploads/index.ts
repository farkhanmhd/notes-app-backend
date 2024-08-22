import { Server, ServerRoute } from '@hapi/hapi';
import StorageService from 'src/services/storage/StorageService';
import UploadsValidator from 'src/validator/uploads';
import UploadsHandler from './handler';
import routes from './routes';

const uploads = {
  name: 'uploads',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      service,
      validator,
    }: { service: StorageService; validator: typeof UploadsValidator }
  ) => {
    const uploadsHandler = new UploadsHandler(service, validator);
    server.route(routes(uploadsHandler) as ServerRoute[]);
  },
};

export default uploads;
