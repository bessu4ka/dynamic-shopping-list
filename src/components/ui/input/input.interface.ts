// types
import type { DetailedHTMLProps, InputHTMLAttributes, JSX } from 'react';

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: JSX.Element;
}
