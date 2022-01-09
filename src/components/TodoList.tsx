import React, {useState, useContext, useEffect} from 'react'
import Paper from '@material-ui/core/Paper';
import Todo from './Todo';
import Box from '@material-ui/core/Box';
import { GlobalContext } from '../context/GlobalState';
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';

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

const useStyles = makeStyles(() => ({
    emptyBox: {
        width: "100%",
        height: "50px",
        alignItems: "center",
        justifyContent: "center"
    }
}));

const serverURL = "http://127.0.0.1:3001/api/v1";

const TodoList = () => {
    const classes = useStyles();
    const context = useContext(GlobalContext);
    const todos = context.todos;
    const displayStatus = context.displayStatus;
    const filterTags = context.filterTags;
    const setTodos = context.setTodos;
    const setTags = context.setTags;

    // Controls and ensures only 1 todo is expanded at a time
    const [expanded, setExpanded] = useState<string | false>(false);
    const handleChange = (panel: string) => (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    // Fetch data from Rails server
    useEffect(() => {
            axios.get(`${serverURL}/todos`)
                .then(res => {
                    setTodos(res.data);
                })
                .catch(error => {
                    console.log(error);
                    alert("An error has occured! Please refresh the page");
                });
        
            axios.get(`${serverURL}/tags`)
                .then(res => {
                    setTags(res.data);
                })
                .catch(error => {
                    console.log(error);
                    alert("An error has occured! Please refresh the page");
                });
    }, []);

    // Filter list of todos by completion status
    function filterListByDisplayStatus(todos: todo[], displayStatus: DisplayStatus): todo[] {
        switch (displayStatus) {
            case (DisplayStatus.completed): return todos.filter((todo) => todo.completion === true); 
            case (DisplayStatus.incomplete): return todos.filter((todo) => todo.completion === false); 
            default: return todos;
        }
    }
    
    // Filter list of todos by tags
    function filterListByTags(todos: todo[], filterTags: tag[]): todo[] {
        function filterByTag(todos: todo[], filterTag: tag): todo[] {
            const filteredTodos: todo[] = [];
            todos.map((todo) => { 
                if (todo.tags.filter((tag) => tag.id === filterTag.id).length > 0) {
                    filteredTodos.push(todo);
                }
            })
            return filteredTodos;
        }

        let displayList = todos;
        if (filterTags.length === 0) {
            return displayList;
        } else {
            filterTags.map(
                (filterTag) => {
                    displayList = filterByTag(displayList, filterTag);
                }
            )
            return displayList;
        }
    }

    const tempList = filterListByDisplayStatus(todos, displayStatus);
    const displayList = filterListByTags(tempList, filterTags); 

    return (
        <div>
            <Paper elevation={3}>
                {displayList.length === 0 
                    ? <Box className={classes.emptyBox}>
                        {/* empty box here */}
                    </Box>
                    : displayList.map(
                    (todo) => 
                        <Todo 
                            key={todo.id} 
                            todo={todo} 
                            expanded={expanded}
                            handleChange={handleChange}/>)
                }
            </Paper>
        </div>
    )
}

export default TodoList
