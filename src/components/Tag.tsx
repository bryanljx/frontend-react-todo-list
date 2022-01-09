import React, { useState, useContext } from 'react'
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";
import { GlobalContext } from '../context/GlobalState';
import axios from 'axios';

interface tag {
    id?: number;
    name: string;
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

interface Props {
    tag: tag,
    deleteAndClickable: boolean
}

const useStyles = makeStyles(() => ({
    boxContainer: {
        display: "inline-flex",
        overflowY: 'unset',
        padding: "0px",
        margin: "2px"
    }
}));

const Tag = (props: Props) => {
    const classes = useStyles();
    const context = useContext(GlobalContext);
    const todos = context.todos;
    const tags = context.tags;
    const filterTags = context.filterTags;
    const setTags = context.setTags;
    const setFilterTags = context.setFilterTags;
    const setTodos = context.setTodos;

    const deleteTag = (deletedTag: tag, ...tags: tag[]): void => {
        // Remove the deletedTag from todos that are tagged with them
        const modifiedTodos: todo[] = [];
        todos.map((affectedTodo) => {
            const modifiedTodo: todo = {
                ...affectedTodo,
                tags: affectedTodo.tags.filter((todoTag) => todoTag.id !== deletedTag.id)
            }
            modifiedTodos.push(modifiedTodo);
        });
        setTodos(modifiedTodos);

        // Remove the deletedTag from tags
        const newTags = tags.filter(
            (existingTag: tag) => existingTag.id !== deletedTag.id
        )
        setTags(newTags);
        
        // Remove the deletedTag from filterTags if filter is currently selected for deletedTag
        const newFilterTags = filterTags.filter(
            (existingFilterTag: tag) => existingFilterTag.id !== deletedTag.id
        )
        setFilterTags(newFilterTags);
        
        // Post delete request to Rails server
        axios.delete(`http://127.0.0.1:3001/api/v1/tags/${deletedTag.id}`)
            // .then(res => console.log(res))
            .catch(error => {
                console.log(error);
                alert("An error has occured! Please refresh the page");
            });
    }

    const addFilterTag = (tag: tag, ...filterTags: tag[]): void => {
        const newFilterTags = [...filterTags, tag];
        setFilterTags(newFilterTags);
    }

    const removeFilterTag = (tag: tag, ...filterTags: tag[]): void => {
        const newFilterTags = filterTags.filter(
            (existingFilterTag) => existingFilterTag.id !== tag.id
        )
        setFilterTags(newFilterTags);
    }

    const [click, setClick] = useState(false); 

    const toggleClick = () => {
        setClick(!click);
        click ? removeFilterTag(props.tag, ...filterTags) : addFilterTag(props.tag, ...filterTags) ;
    }
    
    return (
    <>
        <Box className={classes.boxContainer}>
            {props.deleteAndClickable ?
                <Chip
                    label={props.tag.name}
                    color={click? "secondary" : "primary"}
                    onClick={toggleClick}
                    onDelete={(e: React.SyntheticEvent) => {e.stopPropagation(); deleteTag(props.tag, ...tags)}}
                /> :
                <Chip
                    label={props.tag.name}
                    color="primary"
                    clickable={false}
                />}
        </Box>
    </>
    )
}

export default Tag
