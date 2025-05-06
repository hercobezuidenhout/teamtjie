import { HttpException } from 'next-api-decorators';

export class DescriptiveHttpException extends HttpException {
  description: string;

  constructor(statusCode: number, message: string, description: string) {
    super(statusCode, message);
    this.description = description;
  }
}
