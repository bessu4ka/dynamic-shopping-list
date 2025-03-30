import { useForm, SubmitHandler } from 'react-hook-form';
import {
  editNameFormSchema,
  type EditNameFormType,
} from '../schemas/edit-name.schema';
// hooks
import { useShopList } from '../hooks/use-shopList.query';
import { useRemoveItem } from '../hooks/use-removeItem.mutation';
import { useUpdateName } from '../hooks/use-update-name.mutation';
import { useUpdateQuantity } from '../hooks/use-update-quantity';
import { useEffect, useMemo, useReducer } from 'react';
import { useUpdatePurchaseStatus } from '../hooks/use-update-purchase-status.mutation';
// components
import Plus from '../components/icons/plus';
import Done from '../components/icons/done';
import Input from '../components/ui/input/input';
import Minus from '../components/icons/minus';
import Modal from '../components/ui/modal/modal';
import Button from '../components/ui/button/button';
import Remove from '../components/icons/remove';
import CustomSelect from '../components/ui/select/select';
// utils
import cn from 'classnames';
import { zodResolver } from '@hookform/resolvers/zod';
import { reducer, initialState } from '../store/reducer';
// types
import type { AdjustQuantity } from 'types/list-item.type';
// styles
import styles from './App.module.scss';
import AddItemForm from '../components/templates/add-item-form/add-item-form';

const App = () => {
  const [{ activeItemId, editId, isModalOpen, selectedCategory }, dispatch] =
    useReducer(reducer, initialState);

  const { data = [], error, isLoading } = useShopList();
  const { mutate: updateQuantity } = useUpdateQuantity();
  const { mutate: removeItem } = useRemoveItem();
  const { mutate: updatePurchaseStatus } = useUpdatePurchaseStatus();
  const { mutate: updateName } = useUpdateName();

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
      dispatch({ type: 'TOGGLE_SHOW_INPUT', value: true });
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

  const categories = useMemo(
    () => [
      'All Categories',
      ...Array.from(new Set(data.map(({ category }) => category))),
    ],
    [data],
  );

  const filteredData =
    selectedCategory === 'All Categories'
      ? data
      : data.filter((item) => item.category === selectedCategory);

  const onSubmitName: SubmitHandler<EditNameFormType> = ({ name }) => {
    if (editId) {
      updateName({ name, id: editId });
    }
    dispatch({ type: 'SET_EDIT_ID', id: null });
  };

  const handleAdjustQuantity =
    ({ id, quantity, quantityAdjustment }: AdjustQuantity) =>
    () => {
      const newQuantity = quantity + quantityAdjustment;
      if (newQuantity >= 0) {
        updateQuantity({ id, quantity: newQuantity });
      }
    };

  const handleUpdatePurchaseStatus = (id: string, purchase: boolean) => () => {
    updatePurchaseStatus({ id, purchased: !purchase });
  };

  const openModal = (id: string) => () => {
    dispatch({ type: 'OPEN_MODAL', id });
  };

  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleRemoveItem = () => {
    if (activeItemId) {
      removeItem({ id: activeItemId });
      dispatch({ type: 'CLOSE_MODAL' });
    }
  };

  const handleEditName = (id: string) => () => {
    dispatch({ type: 'SET_EDIT_ID', id });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Shopping List</h1>
        <AddItemForm categories={categories} />
        {!!data.length && (
          <CustomSelect
            label='filter by category'
            value={selectedCategory}
            options={categories}
            onChange={(value) =>
              dispatch({ type: 'SET_CATEGORY', category: value })
            }
          />
        )}
        <ul>
          {filteredData.map(({ id, name, purchased, quantity }) => (
            <li key={id}>
              <div className={styles.buttonsWrapper}>
                <Button
                  aria-label='minus'
                  className={styles.iconButton}
                  onClick={handleAdjustQuantity({
                    id,
                    quantity,
                    quantityAdjustment: -1,
                  })}>
                  <Minus />
                </Button>
                <Button
                  aria-label='plus'
                  className={styles.iconButton}
                  onClick={handleAdjustQuantity({
                    id,
                    quantity,
                    quantityAdjustment: 1,
                  })}>
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
