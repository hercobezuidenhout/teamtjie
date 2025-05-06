import * as R from 'ramda';
import { AnyConstructor } from 'ramda';

export const isNumber = (value: unknown): value is number =>
  R.is(Number, value);

export const isString = (value: unknown): value is string =>
  R.is(String, value);

export const hasProperty = <T extends object>(
  object: unknown,
  name: keyof T,
  ctor: AnyConstructor
) =>
  R.and(R.hasPath([name.toString()], object), R.is(ctor, R.prop(name, object)));

export const hasOptionalProperty = <T extends object>(
  object: unknown,
  name: keyof T,
  ctor: AnyConstructor
) =>
  R.or(
    R.not(R.hasPath([name.toString()], object)),
    R.is(ctor, R.prop(name, object))
  );
