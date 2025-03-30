// types
import type { State, Action } from './types';

export const initialState: State = {
  isModalOpen: false,
  isShowInput: false,
  editId: null,
  activeItemId: null,
  selectedCategory: 'All Categories',
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true, activeItemId: action.id };
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, activeItemId: null };
    case 'TOGGLE_SHOW_INPUT':
      return { ...state, isShowInput: action.value };
    case 'SET_EDIT_ID':
      return { ...state, editId: action.id };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.category };
    default:
      return state;
  }
}
