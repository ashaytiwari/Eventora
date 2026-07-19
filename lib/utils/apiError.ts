export class APIError extends Error {

  constructor(
    public readonly message: string,
    public readonly statusCode = 500,
    public readonly code?: string
  ) {
    super(message);

    this.name = 'APIError';
  }

}