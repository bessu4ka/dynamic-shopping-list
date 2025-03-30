// utils
import cn from 'classnames';
// types
import type { InputProps } from './input.interface.ts';
// styles
import styles from './input.module.scss';
// hoc
import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, error, className, ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label ? (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          className={cn(styles.input, className)}
          {...props}
          id={id}
        />
        {error ? <span className={styles.error}>{error}</span> : null}
      </div>
    );
  },
);

export default Input;
