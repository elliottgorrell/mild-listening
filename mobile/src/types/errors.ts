export class ThirdPartyServiceError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    this.name = "ThirdPartyServiceError";
  }
}
