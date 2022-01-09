import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ContentBar from '../components/ContentBar';
import TodoList from '../components/TodoList';
import TagList from '../components/TagList';
import Header from '../components/Header';
import { GlobalProvider } from '../context/GlobalState';

const Home: React.FC = () => {
    return (
        <GlobalProvider>
            <Header/>
            <Grid 
                container spacing = {2}
                direction="row-reverse"
                justifyContent="center"
                alignItems="flex-start"
            >
                <Grid item xs={12} sm={3}>
                    <Box mr={1}>
                        <TagList />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Box ml={1}>
                        <ContentBar/>
                        <TodoList/>
                    </Box>
                </Grid>
            </Grid>
        </GlobalProvider>
    )
}

export default Home;
