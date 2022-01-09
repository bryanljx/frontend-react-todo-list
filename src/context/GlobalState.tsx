import React, { useState, createContext} from 'react';

interface todo {
    id?: number;
    title: string;
    description?: string;
    completion: boolean;
    tags: {
        id?: number;
        name: string;
    }[];
}

interface tag {
    id?: number;
    name: string;
}

enum DisplayStatus {
    all,
    completed,
    incomplete
}

const filterTagList: tag[] = [];
interface GlobalContextType {
    todos: todo[],
    tags: tag[],
    filterTags: tag[],
    displayStatus: DisplayStatus,
    setDisplayStatus: (status: DisplayStatus) => void,
    setTodos: (todos: todo[]) => void,
    setTags: (tags: tag[]) => void,
    setFilterTags: (filterTags: tag[]) => void
}

// Context
export const GlobalContext = createContext<GlobalContextType>({
    todos: [],
    tags: [],
    filterTags: filterTagList,
    displayStatus: DisplayStatus.all,
    setTodos: (todos) => console.warn('no todos provider'),
    setTags: (tags) => console.warn('no tags provider'),
    setFilterTags: (filterTags) => console.warn('no filterTags provider'),
    setDisplayStatus: (status) => console.warn('no display status provider')
})

// Provider
export const GlobalProvider = (props: any) => {
    const [todos, setTodos] = useState<todo[]>([]);
    const [tags, setTags] = useState<tag[]>([]);
    const [filterTags, setFilterTags] = useState<tag[]>([]);
    const [displayStatus, setDisplayStatus] = useState(DisplayStatus.all)

    // const addTodo = (todo: todo, ...todos: todo[]): void => {
    //     const newTodos = [...todos, todo];
    //     setTodos(newTodos);
    // }

    // const deleteTodo = (todo: todo, ...todos: todo[]): void => {
    //     const newTodos = todos.filter(
    //         (existingTodo) => existingTodo.id !== todo.id
    //     )
    //     setTodos(newTodos);
    // }

    // const editTodo = (todo: todo, ...todos: todo[]): void => {
    //     const newTodos = todos.map(
    //         (existingTodo) => existingTodo.id === todo.id ? todo : existingTodo
    //     )
    //     setTodos(newTodos);
    // }

    // const addTag = (tag: tag, ...tags: tag[]): void => {
    //     const newTags = [...tags, tag];
    //     setTags(newTags);
    // }

    // const deleteTag = (tag: tag, ...tags: tag[]): void => {
    //     const newTags = tags.filter(
    //         (existingTag) => existingTag.id !== tag.id
    //     )
    //     setTags(newTags);
    // }

    // const addFilterTag = (tag: tag, ...filterTags: tag[]): void => {
    //     const newFilterTags = [...filterTags, tag];
    //     setFilterTags(newFilterTags);
    // }

    // const removeFilterTag = (tag: tag, ...filterTags: tag[]): void => {
    //     const newFilterTags = filterTags.filter(
    //         (existingFilterTag) => existingFilterTag.id !== tag.id
    //     )
    //     setFilterTags(newFilterTags);
    // }

    return (<GlobalContext.Provider value ={{
        todos: todos,
        tags: tags,
        filterTags: filterTags,
        displayStatus: displayStatus,
        setTodos: setTodos,
        setTags: setTags,
        setFilterTags: setFilterTags,
        setDisplayStatus: setDisplayStatus
    }}>
        {props.children}
    </GlobalContext.Provider>);
}
