## Getting Started

1. **Install dependencies:**

```bash
npm install
```

---

2. **Run the project:**

###### Start both the JSON server (on port 3001) and Vite (on port 3000):

```bash
npm run start
```

---

3. **Separate runs:**

###### Run Vite server:

```bash
npm run dev
```

###### Run JSON server:

```bash
npm run serve
```

---

Thoughts on the Project
I used the regular state management because the application is small, and I only needed to store a few variables. This was sufficient for better management of the app. For everything else, I utilized TanStack React Query, taking advantage of its ability to work with cached data and its straightforward handling of data invalidation and updates.

Since the app is simple and primarily manages a shopping list, I didn't want to overcomplicate things. I simply structured the code into logical folders. For instance, I placed types in a types folder and hooks in a hooks folder. There was no need to create any complex architecture for this small app.

If I were to continue developing this app, I would add the following features:

Animations: To enhance user experience.

Drag-and-drop functionality: To reorder list items.

Search functionality: To search items by category or name.

Component Refactoring: I would break down the App component into smaller parts. While they may not be reused, the component has become large enough that splitting it into smaller pieces would improve maintainability.

Custom Tooltip: I would replace the default HTML tooltip (title) with a custom one for better control.

Notifications: To show notifications after items are deleted.

Settings for Adding Items: A feature to choose whether a new item should be added to the beginning or end of the list.

Areas for Improvement
Category Input and Select: Splitting the category selection into two separate components (input and select) wasn’t the best decision. While I implemented it this way, I didn’t want to complicate things further. Ideally, this should be refactored into a single, more user-friendly component, as the current UX isn’t very intuitive (though I’m not a designer).

Switch Component: The switch component has some issues. For example, it lacks an aria-label, and there are no styles for focus states. I would rewrite this component to address these problems.

Name Editing: The editing of the item name is not very intuitive, as it’s unclear that the name is editable by clicking on it. I would improve the UX here, but again, design is not my strong suit.
