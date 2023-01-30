import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {Logout} from "./Logout";
import {ChatInput} from "./ChatInput";
import axios from "axios";
import {deleteMessageRoute, getMessageRoute, sendMessageRoute, updateMessageRoute} from "../utils";
import {MdDelete} from 'react-icons/md';
import {MdTipsAndUpdates} from 'react-icons/md';

const ChatContainer = ({currentChat, currentUser,}) => {

    const [messages, setMessages] = useState([]);
    const [messageDataToUpdate, setMessageDataToUpdate] = useState({});
    const scrollRef = useRef();

    const handleSendMessage = async (msg) => {
        if (messageDataToUpdate._id) {
            const response = await axios.patch(updateMessageRoute(messageDataToUpdate._id), {
                message: msg,
            });
            const updatedMessage = response.data.message;
            setMessages(prevState => [...prevState].map(msg => msg._id === updatedMessage._id ? {
                ...msg,
                message: updatedMessage.message.text
            } : msg));
            setMessageDataToUpdate({});
            return;
        }

        const response = await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });
        const message = response.data.message;
        setMessages(prevState => [...prevState, {_id: message._id, fromSelf: true, message: message.message.text}]);
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
                    <div className="avatar">
                        <img
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                            alt="avatar"
                        />
                    </div>
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
                                </div>
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
                                        <span onClick={
                                            () => deleteMessage(message._id)}
                                              className={'delete_icons'}>
                                        <MdDelete/>
                                    </span>
                                        : <></>
                                }
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
