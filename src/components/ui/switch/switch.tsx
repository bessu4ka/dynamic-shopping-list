// utils
import cn from 'classnames';
// types
import type { FC } from 'react';
import type { SwitchProps } from './switch.interface';
// styles
import styles from './switch.module.scss';

const Switch: FC<SwitchProps> = ({ checked, onChange, isDisabled }) => {
  return (
    <label className={cn(styles.switch, { [styles.disabled]: isDisabled })}>
      <input
        type='checkbox'
        checked={checked}
        onChange={() => !isDisabled && onChange(!checked)}
        disabled={isDisabled}
      />
      <span className={styles.slider} />
    </label>
  );
};

export default Switch;
