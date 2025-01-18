import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const user = atomWithStorage('user',
  {
    username: null,
    userId: null,
    isHost: false,
    partyCode: null,
  }
);
