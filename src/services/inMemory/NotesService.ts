import { nanoid } from "nanoid";
import INote from "src/types/types";

export default class NotesService {
  private _notes: INote[];

  constructor() {
    this._notes = [];
  }

  addNote({title, body, tags}: { title: string, body: string, tags: string[] }) {
    const id: string = nanoid(16)
    const createdAt: string = new Date().toISOString()
    const updatedAt: string = createdAt

    const newNote: INote = {
      title, tags, body, id, createdAt, updatedAt
    }

    this._notes.push(newNote)

    const isSuccess = this._notes.filter((note: INote) => note.id === id).length > 0

    if(!isSuccess) throw new Error('Catatan gagal ditambahkan')
    
    return id
  }

  getNotes() {
    return this._notes
  }

  getNoteById(id: string){
    const note = this._notes.filter((n: INote) => n.id === id)[0]
    if(!note){
      throw new Error('Catatan tidak ditemukan')
    }

    return note
  }

  editNoteById(id: string, {title, body, tags} : {title: string, body: string, tags: string[]}){
    const index = this._notes.findIndex((note: INote) => note.id === id)

    if(index === -1){
      throw new Error('Gagal memperbarui catatan. Id tidak ditemukan')
    }

    const updatedAt = new Date().toISOString()

    this._notes[index] = {
      ...this._notes[index],
      title,
      tags,
      body,
      updatedAt
    }
  }

  deleteNoteById(id: string){
    const index = this._notes.findIndex((note: INote) => note.id === id)

    if(index === -1){
      throw new Error('Catatan gagal dihapus. Id tidak ditemukan')
    }

    this._notes.splice(index, 1)
  }
} 

