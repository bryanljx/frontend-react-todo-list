import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(() => ({
    box_container: {
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#eeeeee",
        // backgroundColor: "#fafafa",
        height: "30%"
        
    },
    subtitle: {
        fontSize: 36,
        // color: "#bdbdbd",
        color: "#9e9e9e",
        padding: "0px",
        margin: "0px"
    },
    heading: {
        fontSize: 160,
        color: "#535353",
        padding: "0px",
        margin: "0px"
    },
    padding: {
        margin: "2px"
    }
}));

const Header = () => {
    const classes = useStyles();
    const context = useContext(GlobalContext);
    const todos = context.todos;
    return (
        <div className={classes.padding}>
            <Paper elevation={2}>
                <Box className={classes.box_container}>
                    <Typography variant="h1" className={classes.heading} gutterBottom>
                        {todos.length}
                    </Typography>
                    <Typography variant="subtitle1" className={classes.subtitle} gutterBottom>
                        Todos left! Keep up the good work!
                    </Typography>
                </Box>
            </Paper>
        </div>
    )
}

export default Header
