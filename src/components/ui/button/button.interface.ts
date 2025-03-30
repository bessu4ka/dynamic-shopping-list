import type {
  DetailedHTMLProps,
  PropsWithChildren,
  ButtonHTMLAttributes,
} from 'react';

export interface ButtonProps
  extends DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    PropsWithChildren {}
