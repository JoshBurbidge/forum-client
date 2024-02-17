import React from 'react';

export const UserContext = React.createContext({loggedIn: false});
export const UserProvider = UserContext.Provider;
