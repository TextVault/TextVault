export class NotfoundError implements Error {
  constructor(id: string) {
    this.message = `Not found: ${id}`;
    this.name = "NotFoundError";
  }

  message: string;
  name: string;
}
