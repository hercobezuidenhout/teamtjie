import { DescriptiveHttpException } from '../models/types/description-http-exception';
import { isHttpException } from './is-http-exception';
import { hasOptionalProperty } from './type-guard-utils';

export const isDescriptiveHttpException = (
  object: unknown
): object is DescriptiveHttpException => {
  return (
    object !== undefined &&
    isHttpException(object) &&
    hasOptionalProperty<DescriptiveHttpException>(object, 'description', String)
  );
};
