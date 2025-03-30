import { useForm, SubmitHandler } from 'react-hook-form';
import {
  addListItemFormSchema,
  type addListItemFormType,
} from '../schemas/add-list-item-form.schema';
// hooks
import { useAddItem } from '../hooks/useAddItem.mutation';
import { useShopList } from '../hooks/useShopList.query';
import { useRemoveItem } from '../hooks/useRemoveItem.mutation';
import { useUpdateQuantity } from '../hooks/useUpdateQuantity';
import { useEffect, useState } from 'react';
import { useUpdatePurchaseStatus } from '../hooks/useUpdatePurchaseStatus.mutation';
// components
import Plus from '../components/icons/plus';
import Done from '../components/icons/done';
import Input from '../components/ui/input/input';
import Minus from '../components/icons/minus';
import Modal from '../components/ui/modal/modal';
import Button from '../components/ui/button/button';
import Remove from '../components/icons/remove';
import Switch from '../components/ui/switch/switch';
import CustomSelect from '../components/ui/select/select';
// utils
import cn from 'classnames';
import { zodResolver } from '@hookform/resolvers/zod';
// styles
import styles from './App.module.scss';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isShowInput, setIsShowInput] = useState(false);

  const { data = [], error, isLoading } = useShopList();
  const { mutate: addItem, isPending: isAddItemLoading } = useAddItem();
  const { mutate: updateQuantity } = useUpdateQuantity();
  const { mutate: removeItem } = useRemoveItem();
  const { mutate: updatePurchaseStatus } = useUpdatePurchaseStatus();

  useEffect(() => {
    if (!data.length) {
      setIsShowInput(true);
    }
  }, [data]);

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
        reset({
          name: '',
          quantity: undefined,
          category: isShowInput ? '' : watch('category'),
        }),
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

  const openModal = (id: string) => () => {
    setActiveItemId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveItemId(null);
  };

  const handleRemoveItem = () => {
    if (activeItemId) {
      removeItem({ id: activeItemId });
      setActiveItemId(null);
      setIsModalOpen(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Shopping List</h1>
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
                onChange={setIsShowInput}
              />
            </div>
            {!isShowInput && (
              <CustomSelect
                label='select category'
                value={watch('category')}
                options={categories}
                onChange={(value) => reset({ ...watch(), category: value })}
              />
            )}
            {isShowInput && (
              <Input
                id='create new category'
                {...register('category')}
                label='create new category'
                error={errors.category?.message}
              />
            )}
          </div>
          <Button disabled={isAddItemLoading}>Add</Button>
        </form>
        <ul>
          {data.map(({ id, name, purchased, quantity }) => (
            <li key={id}>
              <div className={styles.buttonsWrapper}>
                <Button
                  aria-label='minus'
                  className={styles.iconButton}
                  onClick={() => handleDecrease(id, quantity)}>
                  <Minus />
                </Button>
                <Button
                  aria-label='plus'
                  className={styles.iconButton}
                  onClick={() => handleIncrease(id, quantity)}>
                  <Plus />
                </Button>
                <span>({quantity})</span>
              </div>
              <span className={cn({ [styles.text]: purchased })}>{name}</span>
              <div className={cn(styles.buttonsWrapper, styles.manageButtons)}>
                <Button
                  aria-label='toggle status'
                  className={styles.iconButton}
                  onClick={handleUpdatePurchaseStatus(id, purchased)}>
                  <Done />
                </Button>
                <Button
                  aria-label='remove element'
                  className={styles.iconButton}
                  onClick={openModal(id)}>
                  <Remove />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Are you sure you want to delete the item?</h2>
          <div className={styles.dialogsButtons}>
            <Button onClick={handleRemoveItem}>Yes</Button>
            <Button onClick={closeModal}>No</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default App;
