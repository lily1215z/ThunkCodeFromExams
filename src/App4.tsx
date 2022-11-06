import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import axios from 'axios';

// ==================== Чт-2(4)

// Types
type PostType = {
    body: string
    id: number
    title: string
    userId: number
}

// Api
const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com/'
})

const postsAPI = {
    getPosts() {
        return instance.get<PostType[]>('posts?_limit=15')
    },
}


// Reducer
const initState = [] as PostType[]

type InitStateType = typeof initState

const postsReducer = (state: InitStateType = initState, action: GetPostsActionType): InitStateType => {
    switch (action.type) {
        case 'POSTS/GET-POSTS':
            return action.posts
    }
    return state
}

const getPostsAC = (posts: PostType[]) => ({type: 'POSTS/GET-POSTS', posts} as const)
type GetPostsActionType = ReturnType<typeof getPostsAC>

const getPostsTC = (): AppThunk => (dispatch) => {
    postsAPI.getPosts()
        .then((res) => {
            dispatch(getPostsAC(res.data))
        })
}


// Store
const rootReducer = combineReducers({
    posts: postsReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))
type RootState = ReturnType<typeof store.getState>
type AppDispatch = ThunkDispatch<RootState, unknown, GetPostsActionType>
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, GetPostsActionType>
const useAppDispatch = () => useDispatch<AppDispatch>()
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// App
const App = () => {
    const dispatch = useAppDispatch()
    const posts = useAppSelector(state => state.posts)

    useEffect(() => {
        dispatch(getPostsTC)
    }, [])

    return (
        <>
            <h1>📜 Список постов</h1>
            {
                posts.length
                    ? posts.map(p => {
                        return <div key={p.id}><b>title</b>: {p.title}</div>
                    })
                    : <h2>Постов нету 😥</h2>
            }
        </>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Provider store={store}> <App/></Provider>)



// dispatch(getPostsTC())  - my answer в коде все выводится