import React, { useState, useContext } from 'react';
import Tag from './Tag';
import EditingForm from './Forms/EditingForm';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { teal } from '@material-ui/core/colors';
import { GlobalContext } from '../context/GlobalState';
import axios from 'axios';

interface Props {
    todo: todo, 
    expanded: string | false,
    handleChange: (panel: string) => (event: React.ChangeEvent<unknown>, isExpanded: boolean) => void
}

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

const useStyles = makeStyles(() => ({
    alignRight: {
        float: "right"
    },
    alignLeft: {
        float: "left"
    },
    checkbox: {
        '&$checked': { color: teal }
    }
}));

const TealCheckbox = withStyles({
    root: {
        color: teal[400],
        '&$checked': {
            color: "#1de9b6",
        },
    },
    checked: {},
    })((props: any) => <Checkbox color="default" {...props} />);

const Todo = (props: Props) => {
    const classes = useStyles();
    const context = useContext(GlobalContext);
    const todos = context.todos;
    const setTodos = context.setTodos;

    const deleteTodo = (deletedTodo: todo, ...todos: todo[]): void => {
        const newTodos = todos.filter(
            (existingTodo) => existingTodo.id !== deletedTodo.id
        )
        setTodos(newTodos);

        axios.delete(`http://127.0.0.1:3001/api/v1/todos/${deletedTodo.id}`)
            // .then(res => console.log(res))
            .catch(error => {
                console.log(error);
                alert("An error has occured! Please refresh the page");
            });
    }

    const editTodo = (todo: todo, ...todos: todo[]): void => {
        const newTodos = todos.map(
            (existingTodo) => existingTodo.id === todo.id ? todo : existingTodo
        )
        setTodos(newTodos);
    }

    // Toggle completion of todo when ticking/unticking checkbox
    const editTodoCompletionStatus = (e: React.SyntheticEvent): void => {
        e.stopPropagation();
        const modifiedTodo = {
            ...props.todo,
            completion: !props.todo.completion
        }
        const submitTodo = {
            todo: modifiedTodo
        }
        axios.put(`http://127.0.0.1:3001/api/v1/todos/${modifiedTodo.id}`, submitTodo)
            // .then(res => console.log(res))
            .catch(error => {
                console.log(error);
                alert("An error has occured! Please refresh the page");
            });
        editTodo(modifiedTodo, ...todos);
    }

    const [editingTodo, setEditingTodo] = useState<boolean>(false);
    
    const closeEditForm = ():void => {
        setEditingTodo(false);
    }

    const openEditForm = ():void => {
        setEditingTodo(true);
    }

    return (
        <div>
            <Accordion expanded={props.expanded === `panel ${props.todo.id}`} onChange={props.handleChange(`panel ${props.todo.id}`)}>
                <AccordionSummary
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"
                    id="additional-actions1-header"
                    expandIcon={<ExpandMoreIcon />}
                >
                    <TealCheckbox
                        checked={props.todo.completion}
                        aria-label="Completion"
                        onChange={(event: React.SyntheticEvent) => event.stopPropagation()}
                        onClick={editTodoCompletionStatus}
                        className={classes.checkbox}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <p>{props.todo.title}</p>           
                </AccordionSummary>
                <AccordionDetails style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>
                    <Typography variant="body1">{props.todo.description}</Typography>
                </AccordionDetails>
                <Divider />
                <div>
                    <div className={classes.alignLeft}>
                        <AccordionDetails>
                        {props.todo.tags.map(
                            (tag) => <Tag 
                            key={tag.id} 
                            tag={tag} 
                            deleteAndClickable={false}/>)}
                        </AccordionDetails>
                    </div>
                    <div className={classes.alignRight}>
                        <AccordionActions>
                            <Button 
                                variant="contained" 
                                size="small" 
                                color="primary"
                                onClick={openEditForm}
                                startIcon={<EditIcon />}>
                                Edit
                            </Button>
                            <Button 
                                variant="contained" 
                                size="small" 
                                onClick={()=>deleteTodo(props.todo, ...todos)}
                                color="secondary"
                                startIcon={<DeleteIcon />}>
                                    Delete
                            </Button>
                        </AccordionActions>
                    </div>
                </div>
            </Accordion>
            <EditingForm todo = {props.todo} closeEditForm={closeEditForm} editingTodo={editingTodo} />
        </div>
    )
}

export default Todo
