export class errorDominio extends Error {
  constructor(message: string) {
    super(message);
    this.name = "errorDominio";
  }
}
