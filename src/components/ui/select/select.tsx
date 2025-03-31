import { useState, type FC } from 'react';
// hooks
import { useOutsideClick } from '../../../hooks/use-outside-click';
// types
import type { CustomSelectProps } from './select.interface';
// styles
import styles from './select.module.scss';

const CustomSelect: FC<CustomSelectProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const handleSelectChange = (option: string) => () => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={ref}>
      {label ? <label className={styles.label}>{label}</label> : null}
      <div className={styles.select} onClick={() => setIsOpen((prev) => !prev)}>
        <span>{value || 'Select category'}</span>
        <div className={isOpen ? styles.arrowUp : styles.arrowDown} />
      </div>
      {isOpen && (
        <div className={styles.options}>
          {options.map((option) => (
            <div
              key={option}
              className={styles.option}
              onClick={handleSelectChange(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
