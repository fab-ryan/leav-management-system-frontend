import {
    type TypedUseSelectorHook,
    useDispatch,
    useSelector as _useSelector,
} from 'react-redux';

import AllActions from '../features/allAction';
import { type AppDispatch, type RootState } from '../app/store';
import { bindActionCreators } from '@reduxjs/toolkit';

export const useActions = () => {
    const dispatch = useDispatch<AppDispatch>();
    return bindActionCreators(AllActions, dispatch);
};

export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;
