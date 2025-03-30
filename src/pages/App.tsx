import { useForm, SubmitHandler } from 'react-hook-form';
import {
  addListItemFormSchema,
  type addListItemFormType,
} from '../schemas/add-list-item-form.schema';
// hooks
import { useAddItem } from '../hooks/useAddItem.mutation';
import { useShopList } from '../hooks/useShopList.query';
// components
import Input from '../components/ui/input/input';
import Button from '../components/ui/button/button';
// utils
import { zodResolver } from '@hookform/resolvers/zod';
// styles
import styles from './App.module.scss';

const App = () => {
  const { data = [], error, isLoading } = useShopList();
  const { mutate: addItem, isPending: isAddItemLoading } = useAddItem();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<addListItemFormType>({
    resolver: zodResolver(addListItemFormSchema),
  });

  const categories = Array.from(new Set(data.map(({ category }) => category)));

  const onSubmit: SubmitHandler<addListItemFormType> = (data) =>
    addItem(data, {
      onSuccess: () =>
        reset({ name: '', quantity: 0, category: watch('category') }),
    });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong...</div>;

  return (
    <div>
      <h1>Shopping List</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('name')}
          label='name of product'
          error={errors.name?.message}
        />
        <Input
          type='number'
          {...register('quantity', { valueAsNumber: true })}
          label='quantity'
          error={errors.quantity?.message}
        />
        <select {...register('category')}>
          {categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <Button disabled={isAddItemLoading}>Add</Button>
      </form>
      <div>
        {data.map(({ id, name, purchased, quantity }) => (
          <div key={id}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div>
                <span
                  style={{
                    textDecoration: `${purchased ? 'line-through' : 'none'}`,
                  }}>
                  {name} ({quantity})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
