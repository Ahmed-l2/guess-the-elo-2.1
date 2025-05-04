import { atom } from 'jotai';

export const user = atom({
  userId: null,
  username: null,
  isAuthenticated: false
});
