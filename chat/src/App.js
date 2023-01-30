import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {Chat, Login, NotFound, Registration} from "./pages";
import {SetAvatar} from "./components";

const App = () => {
    return (
        <Routes>
            <Route path={'/registration'} element={<Registration/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path={'/setAvatar'} element={<SetAvatar/>}/>
            <Route path={'/'} element={<Chat/>}/>
            <Route path={'*'} element={<NotFound/>}/>
        </Routes>
    );
};

export {App};
