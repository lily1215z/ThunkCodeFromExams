import React, { useEffect } from 'react'
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import axios from 'axios';

// ==================== Чт-2(7)

// Types
type CommentType = {
    postId: number
    id: number
    name: string
    email: string
    body: string
}

// Api
const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com/'
})

const commentsAPI = {
    getComments() {
        return instance.get<CommentType[]>('comments?_limit=10')
    }}


// Reducer
const initState = [] as CommentType[]

type InitStateType = typeof initState

const commentsReducer = (state: InitStateType = initState, action: ActionsType) => {
    switch (action.type) {
        case 'COMMENTS/GET-COMMENTS':
            return action.comments
    }
    return state
}

const getCommentsAC = (comments: CommentType[]) => ({type: 'COMMENTS/GET-COMMENTS', comments} as const)
type ActionsType = ReturnType<typeof getCommentsAC>


const getCommentsTC = () => (dispatch: DispatchType) => {
    commentsAPI.getComments()
        .then((res) => {
            dispatch(getCommentsAC(res.data))
        })
}


// Store
const rootReducer = combineReducers({
    comments: commentsReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk))
type RootState = ReturnType<typeof rootReducer>
type DispatchType = ThunkDispatch<RootState, unknown, ActionsType>
const useAppDispatch = () => useDispatch<DispatchType>()
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


// App
export const App = () => {

    const comments = useAppSelector(state => state.comments)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getCommentsTC())
    }, [])

    return (
        <>
            <h1>📝 Список комментариев</h1>
            {
                comments.map(c => {
                    return <div key={c.id}><b>Comment</b>: {c.body} </div>
                })
            }
        </>
    )
}

