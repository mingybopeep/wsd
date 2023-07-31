import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";

import { AttachMoney, Logout } from "@mui/icons-material";
import { Box } from "@mui/material";

import { actions } from "../containers/SessionProvider/state";
import { RootState } from "../state";

const WrapperComponent = styled.div`
  && {
    display: flex;
    flex-direction: row;
  }
`;

const Nav = styled.div`
  && {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: radial-gradient(
      circle,
      hsla(246, 42%, 18%, 1) 0%,
      hsla(249, 54%, 5%, 1) 100%
    );
    position: fixed;
    left: 0;
    box-shadow: 2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
      6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
      12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
      100px 100px 80px rgba(0, 0, 0, 0.07);

    *: hover {
      background: black;
    }
  }
`;

const StyledLink = styled(Link)`
  && {
    width: 100%;
    padding: 20px 5px;
    text-align: center;
    font-size: 20px;
    color: white;
  }
`;
const ButtonDiv = styled.div`
  && {
    width: 100%;
    padding: 20px 10px;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
    color: whitesmoke;
  }
`;

const Wrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch();

  const { username } = useSelector((state: RootState) => state.session);
  const { pathname } = useLocation();

  const isAuthenticated = Boolean(username);

  const location = useLocation();

  const logout = () => {
    dispatch(actions.resetState());
  };

  if (pathname !== "/" && !isAuthenticated) {
    dispatch(actions.setTempPath(location.pathname + location.search));
    return <Navigate to={"/"} />;
  }

  return (
    <WrapperComponent>
      {isAuthenticated && (
        <>
          <Nav>
            <StyledLink to="/fixtures">
              <AttachMoney />
            </StyledLink>

            <ButtonDiv onClick={logout}>
              <Logout />
            </ButtonDiv>
          </Nav>
        </>
      )}

      <Box
        sx={{
          height: "100vh",
          width: "100%",
          marginLeft: isAuthenticated ? "44px" : "0px",
          overflow: "scroll",
        }}
      >
        {children}
      </Box>
    </WrapperComponent>
  );
};

export default Wrapper;
