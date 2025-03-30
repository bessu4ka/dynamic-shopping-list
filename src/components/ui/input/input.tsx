// utils
import cn from 'classnames';
// types
import type { InputProps } from './input.interface.ts';
// styles
import styled from './input.module.scss';
// hoc
import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, className, ...props }, ref) => {
    return (
      <div className={styled.container}>
        {label ? (
          <label htmlFor={id} className={styled.label}>
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          className={cn(styled.input, className)}
          {...props}
          id={id}
        />
      </div>
    );
  },
);

export default Input;
