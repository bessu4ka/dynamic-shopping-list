// utils
import cn from 'classnames';
// types
import type { FC } from 'react';
import type { ButtonProps } from './button.interface';
// styles
import styles from './button.module.scss';

const Button: FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button className={cn(className, styles.container)} {...props}>
      {children}
    </button>
  );
};

export default Button;
