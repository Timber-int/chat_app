import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {getUsersRoute} from "../utils";
import {ChatContainer, Contacts, Welcome} from "../components";
import {backgroundImageArray} from "../constants";

const Chat = () => {

    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [backImage, setBackImage] = useState('');

    useEffect(() => {
        const getUser = async () => {
            if (!localStorage.getItem('chat-app-user')) {
                navigate('/login');
            } else {
                await setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user')));
                setIsLoaded(true)
            }
        }
        getUser();
    }, []);

    useEffect(() => {
        const getAllUsers = async () => {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const {data} = await axios.get(`${getUsersRoute}/${currentUser._id}`);
                    await setContacts(data.users);
                } else {
                    navigate('/setAvatar')
                }
            }
        }
        getAllUsers();
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat)
    }

    useEffect(() => {
        const num = Math.ceil(Math.random() * backgroundImageArray.length - 1);
        setBackImage(backgroundImageArray.find((elem, index) => index === num));
    }, [currentChat]);

    return (
        <>
            <Container>
                <div className="container" style={{backgroundImage: `url(${backImage})`}}>
                    <Contacts contacts={contacts} currentUser={currentUser} handleChatChange={handleChatChange}/>
                    {
                        isLoaded && currentUser && currentChat === undefined
                            ?
                            <Welcome currentUser={currentUser}/>
                            :
                            currentChat
                                ?
                                <ChatContainer currentChat={currentChat} currentUser={currentUser}/>
                                :
                                <></>
                    }
                </div>
            </Container>
        </>
    );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export {Chat};
