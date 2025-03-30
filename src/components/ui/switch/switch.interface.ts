export interface SwitchProps {
  label: string;
  checked: boolean;
  isDisabled?: boolean;
  onChange: (checked: boolean) => void;
}
