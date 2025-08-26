import { RefObject, useCallback, useMemo, useReducer, useRef } from "react";

import { defaultState, State } from "./state";
import { Action } from "./actions";
import { reducer } from "./reducer";

// Limit the reducer to accept only 0 or 1 action arguments
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActionArg = [] | [any];
// Get the dispatch type from the reducer arguments (captures optional action argument correctly)
type ActionDispatch<ActionArg extends AnyActionArg> = (...args: ActionArg) => void;

export type Handler = {
    refs: RefObject<HTMLInputElement[]>;
    state: State;
    dispatch: ActionDispatch<[Action]>;
    value: string;
    setValue: (value: string) => void;
};

export function usePinField(): Handler {
    const refs = useRef<HTMLInputElement[]>([]);
    const [state, dispatch] = useReducer(reducer, defaultState);

    const value = useMemo(() => {
        let value = "";
        for (let index = 0; index < state.length; index++) {
            value += index in state.values ? state.values[index] : "";
        }
        return value;
    }, [state]);

    const setValue = useCallback(
        (value: string) => {
            dispatch({ type: "handle-change", index: 0, value, reset: true });
        },
        [dispatch, state.cursor]
    );

    return useMemo(
        () => ({ refs, state, dispatch, value, setValue }),
        [refs, state, dispatch, value, setValue]
    );
}
