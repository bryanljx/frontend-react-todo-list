import React, {useState, useContext} from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from "@material-ui/core/styles";
import { GlobalContext } from '../../context/GlobalState';
import axios from 'axios';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface Props {
    todo: {
        id?: number;
        title: string;
        description?: string;
        completion: boolean;
        tags: {
            id?: number;
            name: string;
        }[];
    },
    closeEditForm: ()=> void,
    editingTodo: boolean
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

interface tag {
    id?: number;
    name: string;
}

const useStyles = makeStyles(() => ({
    chips: {
        margin: "2px"
    }
}));

//const serverURL = "http://127.0.0.1:3001/api/v1";
const serverURL = "https://todo-list-backend-rails-api.herokuapp.com/api/v1";
const EditingForm = (props: Props) => {
    const classes = useStyles();
    const context = useContext(GlobalContext);
    const todos = context.todos;
    const tags = context.tags;
    const setTodos = context.setTodos;

    // Set the tags which the todo is tagged by for the select box
    const todoTags = props.todo.tags.map((tag) => tag.name);
    const [tagList, setTagList] = React.useState<string[]>(todoTags);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setTagList(event.target.value as string[]);
    };

    const [title, setTitle] = React.useState(props.todo.title);
    const [description, setDescription] = React.useState(props.todo.description);

    // Re-fetches data from Rails server after CRUD operation
    const [isReloading, setIsReloading] = useState(false);
    const isTitleEmpty = title === "";

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    // Clears form fields
    const resetChange = () => {
        setTitle(props.todo.title);
        setDescription(props.todo.description);
        setTagList(todoTags);

        props.closeEditForm();
    }

    const editTodo = (todo: todo, ...todos: todo[]): void => {
        const newTodos = todos.map(
            (existingTodo) => existingTodo.id === todo.id ? todo : existingTodo
        )
        setTodos(newTodos);
    }

    const saveTodo = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (isTitleEmpty) {
            // Do Nothing
            // Title Field is not supposed to be empty
        } else {
            const selectedTags:tag[] = [];
            tagList.map(
                (selectedTag) => {
                    const currTag = tags.find(tag => tag.name === selectedTag) as tag;
                    selectedTags.push(currTag);
                }
            )
            const editedTodo: todo = {
                ...props.todo,
                title: title,
                description: description,
                tags: selectedTags
            }

            // editTodo(editedTodo, ...todos);

            const submitTodo: any = {
                todo: editedTodo
            }

            // Update todo
            axios.put(`${serverURL}/todos/${editedTodo.id}`, submitTodo)
                // .then(res => console.log(res.data))
                .catch(error => {
                    console.log(error);
                    alert("An error has occured! Please refresh the page");
                });

            // Update the tags belonging to the todo
            const tagID = editedTodo.tags.map((tag) => tag.id);
            const editedTodoTags = { tags: tagID, empty: tagID.length === 0}
            axios.post(`${serverURL}/todos/${editedTodo.id}/tags`, editedTodoTags)
                .then(res => editTodo(res.data, ...todos))
                .catch(error => {
                    console.log(error);
                    alert("An error has occured! Please refresh the page");
                });

            // Reload the data
            // setIsReloading(true);
            props.closeEditForm();
        }
    }

    // if (isReloading) {
    //     axios.get(`http://127.0.0.1:3001/api/v1/todos`)
    //         .then(res => {
    //             // console.log(res.data)
    //             setTodos(res.data);
    //             setIsReloading(false);
    //         })
    //         .catch(error => console.log(error));
    // }

    return (
        <div>
            <Dialog open={props.editingTodo} onClose={resetChange} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <TextField
                    autoFocus
                    maxRows={1}
                    value={title}
                    required 
                    margin="dense"
                    id="title"
                    label="title"
                    type="title"
                    variant="standard"
                    error={isTitleEmpty}
                    helperText={isTitleEmpty ? "Required" : ""}
                    onChange={handleTitleChange}
                    fullWidth
                    />
                    <TextField
                    autoFocus
                    multiline
                    maxRows={4}
                    value={description}
                    margin="dense"
                    id="description"
                    label="description"
                    type="description"
                    variant="standard"
                    onChange={handleDescriptionChange}
                    fullWidth
                    />

                    <FormControl margin="normal">
                        <InputLabel id="select-multiple-tags">Tags</InputLabel>
                        <Select
                        labelId="tagList-form"
                        id="tagList"
                        multiple
                        value={tagList}
                        onChange={handleChange}
                        input={<Input id="select-multiple-tags" />}
                        renderValue={(selected) => (
                            <div>
                            {(selected as string[]).map((value) => (
                                <Chip key={value} label={value} color="primary" className={classes.chips}/>
                            ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                        >
                            {tags.map((tag) => (
                                <MenuItem key={tag.id} value={tag.name}>
                                    {tag.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button 
                        variant="contained" 
                        size="small" 
                        startIcon={<CancelIcon />}
                        onClick={resetChange} 
                        color="primary">
                        Cancel
                    </Button>
                    <form onSubmit={saveTodo}>
                        <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<SaveIcon />}
                            type="submit"
                            color="secondary">
                            Save
                        </Button>
                    </form>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default EditingForm
