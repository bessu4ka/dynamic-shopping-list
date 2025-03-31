import { useForm, SubmitHandler } from 'react-hook-form';
import {
  updateNameFormSchema,
  type UpdateNameFormType,
} from '../schemas/update-name-form.schema';
import {
  addListItemFormSchema,
  type AddListItemFormType,
} from '../schemas/add-list-item-form.schema';
// hooks
import { useAddItem } from '../hooks/use-add-item.mutation';
import { useShopList } from '../hooks/use-shop-list.query';
import { useUpdateName } from '../hooks/use-update-name.mutation';
import { useRemoveItem } from '../hooks/use-remove-item.mutation';
import { useOutsideClick } from '../hooks/use-outside-click';
import { useUpdateQuantity } from '../hooks/use-update-quantity';
import { useEffect, useState } from 'react';
import { useUpdatePurchaseStatus } from '../hooks/use-update-purchase-status.mutation';
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
// types
import type { ListItem, QuantityChangeParams } from '../types/list-item.type';
// styles
import styles from './App.module.scss';

const App = () => {
  const formRef = useOutsideClick<HTMLFormElement>(() => setEditId(null));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isShowInput, setIsShowInput] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const { data = [], error, isLoading } = useShopList();
  const { mutate: addItem, isPending: isAddItemLoading } = useAddItem();
  const { mutate: updateQuantity } = useUpdateQuantity();
  const { mutate: removeItem } = useRemoveItem();
  const { mutate: updatePurchaseStatus } = useUpdatePurchaseStatus();
  const { mutate: updateName } = useUpdateName();

  const {
    reset,
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddListItemFormType>({
    resolver: zodResolver(addListItemFormSchema),
  });

  const {
    setValue: setUpdateNameValue,
    register: updateNameRegister,
    handleSubmit: handleUpdateNameSubmit,
    formState: { errors: updateNameErrors },
  } = useForm<UpdateNameFormType>({
    resolver: zodResolver(updateNameFormSchema),
  });

  useEffect(() => {
    if (!data.length) {
      setIsShowInput(true);
    }
  }, [data]);

  useEffect(() => {
    const itemToEdit = data.find(({ id }) => id === editId);

    if (itemToEdit) {
      setUpdateNameValue('name', itemToEdit.name);
    }
  }, [editId, data, setUpdateNameValue]);

  const categories = [
    'All Categories',
    ...new Set(data.map(({ category }) => category)),
  ];

  const onSubmit: SubmitHandler<AddListItemFormType> = (data) =>
    addItem(data, {
      onSuccess: () =>
        reset({
          name: '',
          quantity: undefined,
          category: isShowInput ? '' : watch('category'),
        }),
    });

  const onUpdateNameSubmit: SubmitHandler<UpdateNameFormType> = ({ name }) => {
    if (editId !== null) {
      updateName({ name, id: editId });
      setEditId(null);
    }
  };

  const openModal = (id: string) => () => {
    setActiveItemId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveItemId(null);
  };

  const handleQuantityChange =
    ({ id, quantity, action }: QuantityChangeParams) =>
    () => {
      const newQuantity = action === 'increase' ? quantity + 1 : quantity - 1;
      if (newQuantity >= 0) {
        updateQuantity({ id, quantity: newQuantity });
      }
    };

  const handleUpdatePurchaseStatus = (id: string, purchase: boolean) => () => {
    updatePurchaseStatus({ id, purchased: !purchase });
  };

  const handleRemoveItem = () => {
    if (activeItemId) {
      removeItem({ id: activeItemId });
      setActiveItemId(null);
      setIsModalOpen(false);
    }
  };

  const handleUpdateName = (id: string) => () => {
    setEditId(id);
  };

  const filterItemsByCategory = (items: ListItem[], category: string) => {
    return items.filter(
      ({ category: itemCategory }) =>
        category === 'All Categories' || itemCategory === category,
    );
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
                onChange={(value) => setValue('category', value)}
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
        <CustomSelect
          label='filter by category'
          value={selectedCategory}
          options={categories}
          onChange={setSelectedCategory}
        />
        <ul>
          {filterItemsByCategory(data, selectedCategory).map(
            ({ id, name, purchased, quantity }) => (
              <li key={id}>
                <div className={styles.buttonsWrapper}>
                  <Button
                    aria-label='minus'
                    className={styles.iconButton}
                    onClick={handleQuantityChange({
                      id,
                      quantity,
                      action: 'decrease',
                    })}>
                    <Minus />
                  </Button>
                  <Button
                    aria-label='plus'
                    className={styles.iconButton}
                    onClick={handleQuantityChange({
                      id,
                      quantity,
                      action: 'increase',
                    })}>
                    <Plus />
                  </Button>
                  <span>({quantity})</span>
                </div>
                {id === editId ? (
                  <form
                    onSubmit={handleUpdateNameSubmit(onUpdateNameSubmit)}
                    ref={formRef}
                    className={styles.updateNameForm}>
                    <Input
                      {...updateNameRegister('name')}
                      id='update name'
                      error={updateNameErrors.name?.message}
                    />
                    <Button>done</Button>
                  </form>
                ) : (
                  <span
                    title={purchased ? undefined : 'edit'}
                    className={cn({ [styles.text]: purchased })}
                    onClick={purchased ? undefined : handleUpdateName(id)}>
                    {name}
                  </span>
                )}
                <div
                  className={cn(styles.buttonsWrapper, styles.manageButtons)}>
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
            ),
          )}
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
