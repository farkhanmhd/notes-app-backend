import ExportsHandler from './handler';

const routes = (handler: ExportsHandler) => [
  {
    method: 'POST',
    path: '/export/notes',
    handler: handler.postExportNotesHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

export default routes;
