import React, {useEffect, useState} from "react";
import {BsEmojiSmileFill} from "react-icons/bs";
import {IoMdSend, IoMdSettings} from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import {FaFileUpload} from "react-icons/fa";

const ChatInput = ({handleSendMessage, messageDataToUpdate}) => {
    const [msg, setMsg] = useState("");
    const [photo, setPhoto] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (event, emojiObject) => {
        let message = msg;
        message += emojiObject.emoji;
        setMsg(message);
    };

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMessage(msg, photo);
            setMsg("");
            setPhoto(null);
        }
    };

    useEffect(() => {
        if (messageDataToUpdate._id) {
            setMsg(messageDataToUpdate.message);
        }
    }, [messageDataToUpdate._id]);

    return (
        <Container>
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
                    {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>}
                </div>
            </div>
            <form className="input-container" onSubmit={(event) => sendChat(event)}>
                <div className='file_input_box'>
                    <input className='file_input'
                           type="file"
                           id="uploadBtn"
                           name='photo'
                           placeholder={'photo...'}
                           onChange={e => setPhoto(e.target.files[0])}
                    />
                    <label className='file_label' htmlFor="uploadBtn">
                        <FaFileUpload/>
                        Upload photo
                    </label>
                </div>
                <input
                    type="text"
                    placeholder="type your message here"
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                />
                <button type="submit">
                    {
                        messageDataToUpdate._id
                            ?
                            <IoMdSettings/>
                            :
                            <IoMdSend/>
                    }
                </button>
            </form>
        </Container>
    );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;

      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }

      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;

        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;

          &-thumb {
            background-color: #9a86f3;
          }
        }

        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }

        .emoji-search {
          background-color: white;
          border-color: #9a86f3;
          color: #080420;
        }

        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;

    .file_input_box {
      display: flex;
      justify-content: center;
    }

    .file_input {
      display: none;
    }

    label {
      display: inline-block;
      text-transform: uppercase;
      text-align: center;
      user-select: none;
      cursor: pointer;
      background-color: #9a86f3;
      color: white;
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      justify-content: center;
      align-items: center;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
    }

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;

export {ChatInput};
