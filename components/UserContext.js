import React from 'react';

export const UserContext = React.createContext({ username: 'default', loggedIn: true, userId: 0 });
export const UserProvider = UserContext.Provider;
