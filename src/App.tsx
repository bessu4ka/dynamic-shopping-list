import { useState } from 'react';

// TODO mock data, need upd
const categories = ['Fruits', 'Dairy', 'Vegetables', 'Others'];

interface Item {
  id: number;
  name: string;
  quantity: string;
  category: string;
  purchased: boolean;
}

const App = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Item>({
    id: 0,
    name: '',
    quantity: '',
    category: 'Fruits',
    purchased: false,
  });
  const [filter, setFilter] = useState('All');

  const addItem = () => {
    setItems([...items, { ...newItem, id: Date.now(), purchased: false }]);

    setNewItem({
      id: Date.now(),
      name: '',
      quantity: '',
      category: 'Fruits',
      purchased: false,
    });
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const togglePurchased = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item,
      ),
    );
  };

  const filteredItems =
    filter === 'All' ? items : items.filter((item) => item.category === filter);

  return (
    <div>
      <h1>Shopping List</h1>
      <div>
        <input
          placeholder='Item name'
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />

        <input
          type='number'
          placeholder='Qty'
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />

        <select
          value={newItem.category}
          onChange={(e) =>
            setNewItem({ ...newItem, category: e.target.value })
          }>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button onClick={addItem}>Add</button>
      </div>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value='All'>All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div>
        {filteredItems.map((item) => (
          <div key={item.id}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div>
                <span
                  style={{
                    textDecoration: `${
                      item.purchased ? 'none' : 'line-through'
                    }`,
                  }}>
                  {item.name}({item.quantity})
                </span>
              </div>
              <div>
                <button onClick={() => togglePurchased(item.id)}>done</button>
                <button onClick={() => removeItem(item.id)}>remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
