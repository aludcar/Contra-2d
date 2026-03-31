import { useEffect, useRef } from 'react';
import type { InputState } from '@/types/game';

const JUMP_KEYS = new Set(['ArrowUp', 'w', 'W', ' ', 'j', 'J']);
const SHOOT_KEYS = new Set(['k', 'K', 'x', 'X']);

export const useInput = (): React.MutableRefObject<InputState> => {
  const inputRef = useRef<InputState>({
    left: false,
    right: false,
    jumpPressed: false,
    jumpHeld: false,
    shootHeld: false,
    startPressed: false,
  });

  useEffect(() => {
    const down = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') inputRef.current.left = true;
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') inputRef.current.right = true;
      if (JUMP_KEYS.has(event.key)) {
        if (!inputRef.current.jumpHeld) {
          inputRef.current.jumpPressed = true;
        }
        inputRef.current.jumpHeld = true;
      }
      if (SHOOT_KEYS.has(event.key)) inputRef.current.shootHeld = true;
      if (event.key === 'Enter') inputRef.current.startPressed = true;
    };

    const up = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') inputRef.current.left = false;
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') inputRef.current.right = false;
      if (JUMP_KEYS.has(event.key)) inputRef.current.jumpHeld = false;
      if (SHOOT_KEYS.has(event.key)) inputRef.current.shootHeld = false;
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return inputRef;
};

export const consumeFrameInput = (input: InputState): void => {
  input.jumpPressed = false;
  input.startPressed = false;
};
