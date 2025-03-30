// types.ts
export type State = {
  isModalOpen: boolean;
  isShowInput: boolean;
  editId: null | string;
  activeItemId: null | string;
  selectedCategory: string;
};

export type Action =
  | { type: 'OPEN_MODAL'; id: string }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_EDIT_ID'; id: string | null }
  | { type: 'SET_CATEGORY'; category: string }
  | { type: 'TOGGLE_SHOW_INPUT'; value: boolean };
