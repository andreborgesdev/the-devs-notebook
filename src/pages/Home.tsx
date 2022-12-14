import 'react-pro-sidebar/dist/css/styles.css';
import { List, ListIcon, ListItem, Stack, Text } from "@chakra-ui/react";
import { FaCheckCircle } from 'react-icons/fa';

export const Home = () => {
    return (
        <div>
            <Stack spacing={3}>
                <Text fontSize='xl'>A community made from devs to devs</Text>
                <Text fontSize='m'>Do your remember those really well put together notes that someone made on college that just saved your life for a test? That's what this community aspires to do!</Text>
                <Text fontSize='m'>We can all learn from each other, so there is clearly an added value of these notes being shared and editable by everyone. By having the community improving and creating new content this would massively make everyone's educational IT journey a lot better.</Text>
                <Text fontSize='m'>This platform can be a great tool, not only to study for job interviews, but also to use it in our daily lives as IT professionals. For example, it is a place where we can quickly refresh our memory in a specific topic we haven't worked with for a while, or even to learn something new quickly.</Text>
                <Text fontSize='m'>The main goal is that the notes stay as concise and informative as possible. Plus, we should strive to have a Q&A/quizz for each topic because sometimes the best way to learn is by ask the right questions. Also, it would be good to have some kind of cheatsheet per topic for a fast information check. The topics can range on all kinds of IT related fields.</Text>
                <Text fontSize='m'>Want to contribute?</Text>
                <Text fontSize='m'>Github logo</Text>
                <Text>Let the journey begin</Text>
            </Stack>
        </div>
    );
}