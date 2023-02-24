import React from "react";
import { io } from "socket.io-client";

export const socket = io('http://localhost:5500');
const socketContext = React.createContext(socket);