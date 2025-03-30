// utils
import cn from 'classnames';
// types
import type { FC } from 'react';
import type { SwitchProps } from './switch.interface';
// styles
import styles from './switch.module.scss';

const Switch: FC<SwitchProps> = ({ checked, onChange, isDisabled, label }) => {
  const switchId = `switch-${
    label?.replace(/\s+/g, '-').toLowerCase() || 'id'
  }`;

  return (
    <label className={cn(styles.switch, { [styles.disabled]: isDisabled })}>
      <input
        id={switchId}
        type='checkbox'
        checked={checked}
        onChange={() => !isDisabled && onChange(!checked)}
        disabled={isDisabled}
        aria-labelledby={label ? `${switchId}-label` : undefined}
      />
      {label && (
        <span id={`${switchId}-label`} className={styles.visuallyHidden}>
          {label}
        </span>
      )}
      <span className={styles.slider} />
    </label>
  );
};

export default Switch;
