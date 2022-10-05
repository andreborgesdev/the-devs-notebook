import 'react-pro-sidebar/dist/css/styles.css';
import { List, ListIcon, ListItem, Stack, Text } from "@chakra-ui/react";
import { FaCheckCircle } from 'react-icons/fa';

export const Home = () => {
    return (
        <div>
            <Stack spacing={3}>
                <Text fontSize='xl'>A community made from devs to devs</Text>
                <Text fontSize='m'>Do your remember those really well put together notes that someone made on college that just
                saved your life for a test? That's what this community aspires to do!</Text>
                <Text fontSize='m'>This platform was initally designed with the goal of sharing my notes to some of my personal friends.
                However, it was clear that the added value of these notes being shared with everyone for them to also learn and improve them
                would have an even bigger impact in our educational journey in IT.</Text>
                <Text fontSize='m'>The main goal is that the notes stay as concise and informative as possible.</Text>
                <Text fontSize='m'>The main use case for them is not only to study for job interviews but also to use them
                in our daily lives as IT professionals as cheatsheets, for example.</Text>
                <Text fontSize='m'>All contributions to extend and improve this project are highly appreciated. Those can be something like:</Text>
                <List spacing={3}>
                    <ListItem>
                        <ListIcon as={FaCheckCircle} color='green.500' />
                        Improve the UI/UX of the website
                    </ListItem>
                    <ListItem>
                        <ListIcon as={FaCheckCircle} color='green.500' />
                        Create new content topics
                    </ListItem>
                    <ListItem>
                        <ListIcon as={FaCheckCircle} color='green.500' />
                        Extend/Improve the current content
                    </ListItem>
                </List>
                <Text fontSize='m'>To do something related to the content go the the 'resources' folder and you will find the markdown files to edit.</Text>
            </Stack>
        </div>
    );
}