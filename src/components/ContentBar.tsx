import React, { useState, useContext } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddForm from './Forms/AddForm';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { GlobalContext } from '../context/GlobalState';
import FormControl from '@material-ui/core/FormControl';

enum DisplayStatus {
    all,
    completed,
    incomplete
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1
    },
    box_container: {
      padding: "5px"
    },
    flex_container: {
      display: "flex",
      justifyContent: "space-between",
      padding: "5px",
      margin: "3px"
    }
  }),
);
const ContentBar = () => {
  const classes = useStyles();
  const context = useContext(GlobalContext);
  const displayStatus = context.displayStatus;
  const setDisplayStatus = context.setDisplayStatus;

  const [addingTodo, setAddingTodo] = useState<boolean>(false);

  const closeAddForm = ():void => {
    setAddingTodo(false);
  }

  const openAddForm = ():void => {
    setAddingTodo(true);
  }

  return (
    <div className={classes.root}>
      <div className={classes.flex_container}>
        <div className="classes.box_container">
          <FormControl size="small" variant="outlined">
            <Select
              labelId="displayStatus"
              id="displayStatus"
              value={displayStatus}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => setDisplayStatus(e.target.value as DisplayStatus)}
              label="show status">
              <MenuItem value={DisplayStatus.all}>All</MenuItem>
              <MenuItem value={DisplayStatus.completed}>Completed</MenuItem>
              <MenuItem value={DisplayStatus.incomplete}>Incomplete</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="classes.box_container">
          <Button 
            variant="outlined" 
            size="medium" 
            onClick={openAddForm} 
            color="primary">
            Add Todo
          </Button>
        </div>
      </div>
      <AddForm closeAddForm={closeAddForm} addingTodo={addingTodo}></AddForm>
    </div>
  );
}

export default ContentBar;
