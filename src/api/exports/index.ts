import { Server, ServerRoute } from '@hapi/hapi';
import ExportsValidator from 'src/validator/exports';
import ProducerService from 'src/services/rabbitmq/ProducerService';
import ExportsHandler from './handler';
import routes from './routes';

const exportsPlugin = {
  name: 'exportsplugin',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      service,
      validator,
    }: { service: typeof ProducerService; validator: typeof ExportsValidator }
  ) => {
    const exportsHandler = new ExportsHandler(service, validator);
    server.route(routes(exportsHandler) as ServerRoute[]);
  },
};

export default exportsPlugin;
