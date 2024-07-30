export interface INote {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface INotePayload {
  title: string;
  tags: string[];
  body: string;
}
