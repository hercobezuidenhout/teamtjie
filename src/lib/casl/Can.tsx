import { useAbilities } from '@/contexts/AbilityContextProvider';
import { AbilityTuple, SubjectType } from '@casl/ability';
import { PropsWithChildren } from 'react';

export type CanProps<T extends AbilityTuple> = PropsWithChildren & {
  I: T[0];
  this?: Exclude<T[1], SubjectType>;
  field?: string;
  not?: boolean;
};

export const Can = <T extends AbilityTuple>({
  children,
  I,
  field,
  not,
  this: subject,
}: CanProps<T>) => {
  const ability = useAbilities();
  const check = not ? 'cannot' : 'can';
  const hasAbility = ability[check](I, subject, field);

  return <>{hasAbility ? children : null}</>;
};
