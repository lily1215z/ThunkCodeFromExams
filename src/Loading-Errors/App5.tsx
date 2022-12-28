
// ==================== Чт-3(5)

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import axios, { AxiosError } from 'axios';


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
        // return instance.get<CommentType[]>('commentaries')
        return instance.get<CommentType[]>('comments?postId=1')  //my answer
    }
}

// Reducer
const initState = {
    comments: [] as CommentType[]
}

type InitStateType = typeof initState

const appReducer = (state: InitStateType = initState, action: ActionsType) => {
    switch (action.type) {
        case 'COMMENTS/GET-COMMENTS':
            return {...state, comments: action.comments}
        default:
            return state
    }
}

const getCommentsAC = (comments: CommentType[]) => ({type: 'COMMENTS/GET-COMMENTS', comments} as const)
type ActionsType = ReturnType<typeof getCommentsAC>

// Thunk
const getCommentsTC = (): AppThunk => (dispatch) => {

    commentsAPI.getComments()
        .then((res) => {
            dispatch(getCommentsAC(res.data))
        })
        .catch((e: AxiosError) => {
            alert(`Сообщение об ошибке: ${e.message}`)
        })
}


// Store
const rootReducer = combineReducers({
    app: appReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk))
type RootState = ReturnType<typeof store.getState>
type AppDispatch = ThunkDispatch<RootState, unknown, ActionsType>
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, ActionsType>
const useAppDispatch = () => useDispatch<AppDispatch>()
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


// Components
export const App = () => {

    const comments = useAppSelector(state => state.app.comments)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getCommentsTC())
    }, [])

    return (
        <>
            <h1>📝 Список комментариев</h1>
            {
                comments
                    ?
                    comments.map(c => {
                        return <div key={c.id}><b>Comment</b>: {c.body} </div>
                    })
                    :
                    <h3>❌ Комментарии не подгрузились. Произошла какая-то ошибка. Найди и исправь ее</h3>
            }
        </>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Provider store={store}> <App/></Provider>)