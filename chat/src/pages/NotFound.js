import React from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";

const NotFound = () => {
    return (
        <Container>
            <Link to={'/'}>There is nothing on this page...</Link>
        </Container>
    );
};

const Container = styled.div`
  background-color: #131324;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 4rem;

  a {
    text-decoration: none;
  color: white;
  }

`;

export {NotFound};
