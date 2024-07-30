import { INote } from 'src/types/types';

const mapDBToModel = ({
  id,
  title,
  body,
  tags,
  createdAt,
  updatedAt,
}: INote) => ({
  id,
  title,
  body,
  tags,
  createdAt,
  updatedAt,
});

export default mapDBToModel;
