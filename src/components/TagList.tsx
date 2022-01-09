import React, { useContext } from 'react'
import Paper from '@material-ui/core/Paper';
import Tag from './Tag';
import { GlobalContext } from '../context/GlobalState';
import Divider from '@material-ui/core/Divider';
import AddTagField from './AddTagField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    container: {
        margin: "10px"
    },
    heading: {
        fontSize: 24,
        padding: "0px",
        margin: "0px"
    }
}));

const TagList = () => {
    const classes = useStyles();
    const context = useContext(GlobalContext);
    const tags = context.tags;

    return (
        <div className={classes.container}>
            <Paper elevation={3}>
                <Box height={180}>
                    <Typography variant="subtitle1" className={classes.heading}>Tags</Typography>
                    {tags.map(
                        (tag) => <Tag 
                            key={tag.id} 
                            tag={tag} 
                            deleteAndClickable={true} />)}
                </Box>
                <Divider />
                <AddTagField />
            </Paper>
        </div>
    )
}

export default TagList
