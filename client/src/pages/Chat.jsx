import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
const REACT_APP_LOCALHOST_KEY = "LoggedIn";

export default function Chat() {
    const navigate = useNavigate();
axios.defaults.withCredentials = true;
    const socket = useRef(null);

    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);
    useEffect(() => {
        // change 
        const fun = async () => {
            if (!localStorage.getItem(REACT_APP_LOCALHOST_KEY)) {
                navigate("/login");
            } else {
                setCurrentUser(
                    await JSON.parse(
                        localStorage.getItem(REACT_APP_LOCALHOST_KEY)
                    )
                );
            }
        }
        fun();
    }, []);
    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        const fun = async () => {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setContacts(data.data);

                } else {
                    navigate("/setAvatar");
                }
            }
        }
        fun();
    }, [currentUser]);
    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };
    return (
        <>
            <Container>
                <div className="container">
                    <Contacts contacts={contacts} changeChat={handleChatChange} />
                    {currentChat === undefined ? (
                        <Welcome />
                    ) : (
                        <ChatContainer currentChat={currentChat} socket={socket} />
                    )}
                </div>
            </Container>
        </>
    );
}

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
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
