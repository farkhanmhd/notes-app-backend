import fs from 'fs';

export default class StorageService {
  private _folder: string;

  constructor(folder: string) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    this.writeFile = this.writeFile.bind(this);
  }

  writeFile(file: fs.ReadStream, meta: { filename: string }) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}
