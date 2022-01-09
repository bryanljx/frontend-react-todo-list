import React, { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalState';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';

const useStyles = makeStyles(() => ({
    alignRight: {
        float: "right"
    },
    alignLeft: {
        float: "left",
        width: "82%",
        marginTop: "4px",
        marginLeft: "7px"
    }
}));

interface tag {
    id?: number;
    name: string;
}

const AddTagField = () => {
    const classes = useStyles();
    const context = useContext(GlobalContext);
    const tags = context.tags;
    const setTags = context.setTags;

    const [tagName, setTagName] = useState("");
    const [isReloading, setIsReloading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagName(e.target.value)
    }

    const addTag = (tag: tag, ...tags: tag[]): void => {
        const newTags = [...tags, tag];
        setTags(newTags);
    }

    const addNewTag = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (tagName === "" || isError) {
            // Do nothing
        } else {
            const modifiedTag = { tag: { name: tagName }};
            // const newTag = { id: 4, name: tagName };
            // addTag(newTag, ...tags);
            
            axios.post(`http://127.0.0.1:3001/api/v1/tags`, modifiedTag)
                .then(res => addTag(res.data, ...tags))
                .catch(error => {
                    console.log(error);
                    alert("An error has occured! Please refresh the page");
                });
            // setIsReloading(true);
            setTagName("");
        }
    }

    // Reload data after CRUD operation
    // if (isReloading) {
    //     axios.get(`http://127.0.0.1:3001/api/v1/tags`)
    //         .then(res => {
    //             // console.log(res.data)
    //             setTags(res.data);
    //             setIsReloading(false);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             alert("An error has occured! Please refresh the page");
    //         });
    // }

    const isError = tags.filter((tag: tag) => tag.name === tagName).length > 0
    return (
        <div>
            <TextField
                id="add tag field"
                variant="outlined"
                size="small"
                value={tagName}
                error={isError}
                label={isError ? "Duplicated Tag" : ""}
                className={classes.alignLeft}
                onChange={handleInputChange}>
            </TextField>
            <form onSubmit={addNewTag}>
                <IconButton type="submit">
                    <AddIcon />
                </IconButton>
            </form>
        </div>
    )
}

export default AddTagField
