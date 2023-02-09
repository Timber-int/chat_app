import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {Logout} from "./Logout";
import {ChatInput} from "./ChatInput";
import axios from "axios";
import {deleteMessageRoute, getMessageRoute, host, sendMessageRoute, updateMessageRoute} from "../utils";
import {MdDelete} from 'react-icons/md';
import {MdTipsAndUpdates} from 'react-icons/md';
import {NavLink} from "react-router-dom";

const ChatContainer = ({currentChat, currentUser,}) => {

    const [messages, setMessages] = useState([]);
    const [messageDataToUpdate, setMessageDataToUpdate] = useState({});
    const scrollRef = useRef();

    const handleSendMessage = async (msg, photo) => {
        let formData = new FormData();

        if (messageDataToUpdate._id) {
            formData.append('message', msg);

            if (photo !== null) {
                formData.append('photo', photo);
            }

            const response = await axios.patch(updateMessageRoute(messageDataToUpdate._id), formData);

            const updatedMessage = response.data.message;

            setMessages(prevState => [...prevState].map(msg => msg._id === updatedMessage._id ? {
                ...msg,
                message: updatedMessage.message.text,
                photo: updatedMessage.photo,
            } : msg));

            setMessageDataToUpdate({});

            return;
        }

        formData.append('from', currentUser._id);
        formData.append('to', currentChat._id);
        formData.append('message', msg);

        if (photo !== null) {
            formData.append('photo', photo);
        }

        const response = await axios.post(sendMessageRoute, formData);
        const message = response.data.message;
        const uploadedPhoto = message?.photo;

        setMessages(prevState => [...prevState, uploadedPhoto ? {
            _id: message._id,
            fromSelf: true,
            message: message.message.text,
            photo: message.photo
        } : {
            _id: message._id,
            fromSelf: true,
            message: message.message.text,
        }]);
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        const getAllMessages = async () => {
            const response = await axios.post(getMessageRoute, {
                from: currentUser._id,
                to: currentChat._id,
            })

            setMessages(response.data.messages);
        }
        getAllMessages()
    }, [currentChat, currentUser]);
    const deleteMessage = async (id) => {
        const response = await axios.delete(deleteMessageRoute(id));
        const deletedMessageId = response.data.message._id;
        setMessages(prevState => [...prevState].filter(msg => msg._id !== deletedMessageId));
    }

    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <NavLink className="avatar">
                        <img
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                            alt="avatar"
                        />
                    </NavLink>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout/>
            </div>
            <div className="chat-messages">
                {
                    messages.map((message, index) => (
                        <div key={index} ref={scrollRef}>
                            <div className={`message ${message.fromSelf ? 'sender' : 'received'}`}>
                                <div className={'content'}>
                                    <p>{message.message}</p>
                                    {
                                        message.photo
                                            ?
                                            <img className='message_image' src={host + '/' + message.photo}
                                                 alt='photo'/>
                                            :
                                            <></>
                                    }
                                </div>
                                <div className='button_container'>
                                    {
                                        message.fromSelf
                                            ?
                                            <span onClick={
                                                () => setMessageDataToUpdate(message)}
                                                  className={'update_icons'}>
                                        <MdTipsAndUpdates/>
                                    </span>
                                            : <></>
                                    }
                                    {
                                        message.fromSelf
                                            ?
                                            <span disa onClick={
                                                () => deleteMessage(message._id)}
                                                  className={'delete_icons'}>
                                        <MdDelete/>
                                    </span>
                                            : <></>
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <ChatInput
                handleSendMessage={handleSendMessage}
                messageDataToUpdate={messageDataToUpdate}
            />
        </Container>
    );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }

        img {
          width: 100%;
          height: 300px;
        }
      }

      .delete_icons {
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        color: white;

        &:hover {
          color: #c62828;
        }
      }

      .update_icons {
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        color: white;

        &:hover {
          color: yellow;
        }
      }
    }

    .sender {
      justify-content: flex-end;

      &:hover .delete_icons {
        display: flex;
      }

      &:hover .update_icons {
        display: flex;
      }

      .button_container {
        width: 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
      }

      .content {
        background-color: #4f04ff21;
        color: #FAFDFF;
      }

    }

    .received {
      justify-content: flex-start;

      .content {
        background-color: #4f04ff21;
        color: #FAFDFF;
      }
    }
  }
`;
export {ChatContainer};
