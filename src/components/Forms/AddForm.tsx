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
    closeAddForm: ()=> void,
    addingTodo: boolean
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

const AddForm = (props: Props) => {
    const classes = useStyles();
    const context = useContext(GlobalContext);
    const todos = context.todos;
    const tags = context.tags;
    const setTodos = context.setTodos;

    // For the select box UI element in the add form
    const [tagList, setTagList] = React.useState<string[]>([]);
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setTagList(event.target.value as string[]);
    };

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [isTitleEmpty, setIsTiTleEmpty] = React.useState(false);
    const [isReloading, setIsReloading] = useState(false);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        if(event.target.value === "") {
            setIsTiTleEmpty(true);
        } else {
            setIsTiTleEmpty(false);
        }
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const resetChange = () => {
        setTitle("");
        setDescription("");
        setTagList([]);

        props.closeAddForm();
    }

    const addTodo = (todo: todo, ...todos: todo[]): void => {
        const newTodos = [...todos, todo];
        setTodos(newTodos);
    }

    const addNewTodo = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (title === "") {
            // Trigger error if title field is empty
            setIsTiTleEmpty(true);
        } else {
            const todoTags:tag[] = [];
            tagList.map(
                (selectedTag) => {
                    const currTag = tags.find(tag => tag.name === selectedTag) as tag;
                    todoTags.push(currTag);
                }
            )
            const newTodo: todo = {
                id: -1,
                title: title,
                description: description,
                completion: false,
                tags: todoTags
            }
            
            const testTodo: any = {
                todo: {
                    title: title,
                    description: description,
                    completion: false
                }
            }
            
            // Create the new todo first
            axios.post(`http://127.0.0.1:3001/api/v1/todos`, testTodo)
                .then(res => {
                    // console.log(res.data.id);
                    const modifiedTodo = {
                        ...res.data,
                        tags: todoTags
                    }

                    // To ease the difficulty handling params in Rails server
                    const tagID = modifiedTodo.tags.map((tag: tag) => tag.id);
                    const editedTodoTags = { tags: tagID, empty: tagID.length === 0 }

                    // Then add selected tags to todo
                    axios.post(`http://127.0.0.1:3001/api/v1/todos/${modifiedTodo.id}/tags`, editedTodoTags)
                        .then(res => addTodo(res.data, ...todos))
                        .catch(error => {
                            console.log(error);
                            alert("An error has occured! Please refresh the page");
                        });
                })
                .catch(error => {
                    console.log(error);
                    alert("An error has occured! Please refresh the page");
                });
            // addTodo(newTodo, ...todos);
            // setIsReloading(true);
            resetChange();
        }
    }

    // if (isReloading) {
    //     axios.get(`http://127.0.0.1:3001/api/v1/todos`)
    //             .then(res => {
    //                 // console.log(res.data)
    //                 setTodos(res.data);
    //                 setIsReloading(false);
    //             })
    //         .catch(error => {
    //             console.log(error);
    //             alert("An error has occured! Please refresh the page");
    //         });
    // }

    return (
        <div>
            <Dialog open={props.addingTodo} onClose={resetChange} aria-labelledby="form-dialog-title">
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

                    <FormControl>
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
                    <form onSubmit={addNewTodo}>
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

export default AddForm
