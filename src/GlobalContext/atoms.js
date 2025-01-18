import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const user = atomWithStorage({
  username: null,
  userId: null,
  isHost: false,
  partyCode: null,
})
