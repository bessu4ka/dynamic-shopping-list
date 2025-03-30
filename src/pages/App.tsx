import { useForm, SubmitHandler } from 'react-hook-form';
import {
  addListItemFormSchema,
  type addListItemFormType,
} from '../schemas/add-list-item-form.schema';
// hooks
import { useState } from 'react';
import { useAddItem } from '../hooks/useAddItem.mutation';
import { useShopList } from '../hooks/useShopList.query';
import { useUpdateQuantity } from '../hooks/useUpdateQuantity';
import { useUpdatePurchaseStatus } from '../hooks/useUpdatePurchaseStatus.mutation';
// components
import Plus from '../components/icons/plus';
import Done from '../components/icons/done';
import Input from '../components/ui/input/input';
import Minus from '../components/icons/minus';
import Modal from '../components/ui/modal/modal';
import Button from '../components/ui/button/button';
import CustomSelect from '../components/ui/select/select';
// utils
import { zodResolver } from '@hookform/resolvers/zod';
// styles
import styles from './App.module.scss';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data = [], error, isLoading } = useShopList();
  const { mutate: addItem, isPending: isAddItemLoading } = useAddItem();
  const { mutate: updateQuantity } = useUpdateQuantity();
  const { mutate: updatePurchaseStatus } = useUpdatePurchaseStatus();

  const {
    reset,
    watch,
    register,
    handleSubmit,
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

  const handleIncrease = (id: string, quantity: number) => {
    updateQuantity({ id, quantity: quantity + 1 });
  };

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity > 0) {
      updateQuantity({ id, quantity: quantity - 1 });
    }
  };

  const handleUpdatePurchaseStatus = (id: string, purchase: boolean) => () => {
    updatePurchaseStatus({ id, purchased: !purchase });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
        <CustomSelect
          label='Category'
          value={watch('category')}
          options={categories}
          onChange={(value) => reset({ ...watch(), category: value })}
        />
        <Button disabled={isAddItemLoading}>Add</Button>
      </form>
      <div>
        {data.map(({ id, name, purchased, quantity }) => (
          <div key={id}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div>
                <div className={styles.element}>
                  <Button
                    className={styles.iconButton}
                    onClick={() => handleDecrease(id, quantity)}>
                    <Minus />
                  </Button>
                  <Button
                    className={styles.iconButton}
                    onClick={() => handleIncrease(id, quantity)}>
                    <Plus />
                  </Button>
                  <span>({quantity})</span>
                  <span
                    style={{
                      textDecoration: `${purchased ? 'line-through' : 'none'}`,
                    }}>
                    {name}
                  </span>
                  <Button
                    className={styles.iconButton}
                    onClick={handleUpdatePurchaseStatus(id, purchased)}>
                    <Done />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={openModal}>Open Modal</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>dialog test</h2>
        <button onClick={closeModal}>Close Modal</button>
      </Modal>
    </div>
  );
};

export default App;
