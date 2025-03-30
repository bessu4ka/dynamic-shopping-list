import { useReducer, type FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  type AddListItemFormType,
  addListItemFormSchema,
} from '../../../schemas/add-list-item-form.schema';
// hooks
import { useAddItem } from '../../../hooks/use-add-item.mutation';
import { useShopList } from '../../../hooks/use-shopList.query';
// components
import Input from '../../ui/input/input';
import Switch from '../../../components/ui/switch/switch';
import Button from '../../ui/button/button';
import CustomSelect from '../../../components/ui/select/select';
// utils
import { zodResolver } from '@hookform/resolvers/zod';
import { initialState, reducer } from '../../../store/reducer';
// types
import type { AddItemFormProps } from './add-item-form.interface';
// styles
import styles from './add-item-form.module.scss';

const AddItemForm: FC<AddItemFormProps> = ({ categories }) => {
  const {
    watch,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddListItemFormType>({
    resolver: zodResolver(addListItemFormSchema),
  });

  const [{ isShowInput }, dispatch] = useReducer(reducer, initialState);
  const { data = [] } = useShopList();
  const { mutate: addItem, isPending } = useAddItem();

  const onSubmit: SubmitHandler<AddListItemFormType> = (data) =>
    addItem(data, {
      onSuccess: () =>
        reset({
          name: '',
          quantity: undefined,
          category: isShowInput ? '' : watch('category'),
        }),
    });

  const CategorySelect = () => {
    if (isShowInput) {
      return (
        <Input
          id='create new category'
          {...register('category')}
          label='create new category'
          error={errors.category?.message}
        />
      );
    }
    return (
      <CustomSelect
        label='select category'
        value={watch('category')}
        options={categories}
        onChange={(value) => reset({ ...watch(), category: value })}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.nameAndQuantity}>
        <Input
          id='name'
          {...register('name')}
          label='name of product'
          error={errors.name?.message}
        />
        <Input
          id='quantity'
          type='number'
          {...register('quantity', { valueAsNumber: true })}
          label='quantity'
          error={errors.quantity?.message}
        />
      </div>
      <div className={styles.category}>
        <div className={styles.switchWrapper}>
          <span>{isShowInput ? 'select' : 'input'}</span>
          <Switch
            label='create new category or select'
            checked={isShowInput}
            isDisabled={!data.length}
            onChange={(value) => dispatch({ type: 'TOGGLE_SHOW_INPUT', value })}
          />
        </div>
        <CategorySelect />
      </div>
      <Button disabled={isPending}>Add</Button>
    </form>
  );
};

export default AddItemForm;
