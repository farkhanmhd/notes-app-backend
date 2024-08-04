import { INote } from 'src/types/types';

const mapDBToModel = ({
  id,
  title,
  body,
  tags,
  createdAt,
  updatedAt,
  username,
}: INote) => ({
  id,
  title,
  body,
  tags,
  createdAt,
  updatedAt,
  username,
});

export default mapDBToModel;
