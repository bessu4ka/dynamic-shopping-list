// types
import type { FC } from 'react';
import type { SwitchProps } from './switch.interface';
// styles
import styles from './switch.module.scss';

const Switch: FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <label className={styles.switch}>
      <input
        type='checkbox'
        checked={checked}
        onChange={() => onChange(!checked)}
      />
      <span className={styles.slider} />
    </label>
  );
};

export default Switch;
