/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import { useSelector } from "react-redux";
import Axios from 'axios';
import {
  useHistory
} from "react-router-dom";

function RightMenu(props) {
  let history = useHistory();

  const user = useSelector(state => state.user)

  const logoutHandler = async () => {
    try {
      await Axios.get(`/api/users/logout`)
      history.push("/login");
    } catch (error) {
      alert(error);
    }
  };
  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default RightMenu;

