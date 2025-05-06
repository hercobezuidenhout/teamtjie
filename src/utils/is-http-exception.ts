import { HttpException } from 'next-api-decorators';
import { hasOptionalProperty, hasProperty } from './type-guard-utils';

export const isHttpException = (object: unknown): object is HttpException => {
  return (
    object !== undefined &&
    hasProperty<HttpException>(object, 'statusCode', Number) &&
    hasOptionalProperty<HttpException>(object, 'message', String)
  );
};
