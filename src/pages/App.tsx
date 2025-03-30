import { useForm, SubmitHandler } from 'react-hook-form';
import {
  addListItemFormSchema,
  type AddListItemFormType,
} from '../schemas/add-list-item-form.schema';
import {
  editNameFormSchema,
  type EditNameFormType,
} from '../schemas/edit-name.schema';
// hooks
import { useAddItem } from '../hooks/use-add-item.mutation';
import { useShopList } from '../hooks/use-shopList.query';
import { useRemoveItem } from '../hooks/use-removeItem.mutation';
import { useUpdateName } from '../hooks/use-update-name.mutation';
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
// styles
import styles from './App.module.scss';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isShowInput, setIsShowInput] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string>('All Categories');

  const { data = [], error, isLoading } = useShopList();
  const { mutate: addItem, isPending: isAddItemLoading } = useAddItem();
  const { mutate: updateQuantity } = useUpdateQuantity();
  const { mutate: removeItem } = useRemoveItem();
  const { mutate: updatePurchaseStatus } = useUpdatePurchaseStatus();
  const { mutate: updateName } = useUpdateName();

  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddListItemFormType>({
    resolver: zodResolver(addListItemFormSchema),
  });

  const {
    setValue: setValueName,
    register: registerName,
    handleSubmit: handleSubmitName,
    formState: { errors: errorsName },
  } = useForm<EditNameFormType>({
    resolver: zodResolver(editNameFormSchema),
  });

  useEffect(() => {
    if (!data.length) {
      setIsShowInput(true);
    }
  }, [data]);

  useEffect(() => {
    if (editId) {
      const item = data.find((item) => item.id === editId);
      if (item) {
        setValueName('name', item.name);
      }
    }
  }, [editId, data, setValueName]);

  const categories = [
    'All Categories',
    ...Array.from(new Set(data.map(({ category }) => category))),
  ];

  const filteredData =
    selectedCategory === 'All Categories'
      ? data
      : data.filter((item) => item.category === selectedCategory);

  const onSubmit: SubmitHandler<AddListItemFormType> = (data) =>
    addItem(data, {
      onSuccess: () =>
        reset({
          name: '',
          quantity: undefined,
          category: isShowInput ? '' : watch('category'),
        }),
    });

  const onSubmitName: SubmitHandler<EditNameFormType> = ({ name }) => {
    if (editId) {
      updateName({ name, id: editId });
      setEditId(null);
    }
  };

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

  const handleEditName = (id: string) => () => {
    setEditId(id);
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
        {!!data.length && (
          <CustomSelect
            label='filter by category'
            value={selectedCategory}
            options={categories}
            onChange={(value) => setSelectedCategory(value)}
          />
        )}
        <ul>
          {filteredData.map(({ id, name, purchased, quantity }) => (
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
              {editId === id ? (
                <form onSubmit={handleSubmitName(onSubmitName)}>
                  <Input
                    {...registerName('name')}
                    id='register name'
                    error={errorsName.name?.message}
                  />
                </form>
              ) : (
                <span
                  onClick={purchased ? undefined : handleEditName(id)}
                  className={cn({ [styles.text]: purchased })}>
                  {name}
                </span>
              )}
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
