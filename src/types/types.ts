export interface INote {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  username: string;
}

export interface INotePayload {
  title: string;
  tags: string[];
  body: string;
  owner: string;
}

export interface IUser {
  username: string;
  password: string;
  fullname: string;
}

export interface IAuthPayload {
  username: string;
  password: string;
}
