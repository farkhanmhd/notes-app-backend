export interface INote {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  body: string;
}

export interface INotePayload {
  title: string;
  tags: string[];
  body: string;
}
