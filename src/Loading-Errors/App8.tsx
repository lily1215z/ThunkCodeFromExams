

// ==================== Чт-3(8)

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client';
import { applyMiddleware, combineReducers, legacy_createStore as createStore, Dispatch } from 'redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import axios, { AxiosError } from 'axios'

// TYPES
type UserType = {
    avatar: string
    email: string
    first_name: string
    id: 1
    last_name: string
}

type ColorType = {
    color: string
    id: number
    name: string
    pantone_value: string
    year: number
}

type CommonResponseType<T> = {
    total: number
    total_pages: number
    page: number
    per_page: number
    support: {
        url: string
        text: string
    }
    data: T
}

// API
const instance = axios.create({baseURL: 'https://reqres.in/api/'})

const reqresAPI = {
    getUsers() {
        return instance.get<CommonResponseType<UserType[]>>('users?delay=3')
    },
    getColors() {
        return instance.get<CommonResponseType<ColorType[]>>('colors?delay=3')
    }
}


// Reducer
const initState = {
    isLoading: false,
    error: null as string | null,
    users: [] as UserType[],
    colors: [] as ColorType[],
}

type InitStateType = typeof initState

const appReducer = (state: InitStateType = initState, action: ActionsType): InitStateType => {
    switch (action.type) {
        case 'APP/GET-USERS':
            return {...state, users: action.users}
        case 'APP/GET-COLORS':
            return {...state, colors: action.colors}
        case 'APP/IS-LOADING':
            return {...state, isLoading: action.isLoading}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

const getUsersAC = (users: UserType[]) => ({type: 'APP/GET-USERS', users} as const)
const getColorsAC = (colors: ColorType[]) => ({type: 'APP/GET-COLORS', colors} as const)
const setLoadingAC = (isLoading: boolean) => ({type: 'APP/IS-LOADING', isLoading} as const)
const setError = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
type ActionsType =
    | ReturnType<typeof getUsersAC>
    | ReturnType<typeof getColorsAC>
    | ReturnType<typeof setLoadingAC>
    | ReturnType<typeof setError>

// Utils functions
function baseSuccessHandler<T>(dispatch: Dispatch, actionCreator: Function, data: T) {
    dispatch(actionCreator(data))
    dispatch(setLoadingAC(false))
}

// Thunk
const getUsersTC = (): AppThunk => (dispatch) => {
    dispatch(setLoadingAC(true))
    reqresAPI.getUsers()
        .then((res) => {
            // XXX
            dispatch(getUsersAC(res.data.data))  // my answer
        })
        .catch((e: AxiosError) => {
            dispatch(setError(e.message))
            dispatch(setLoadingAC(false))
        })
}

const getColorsTC = (): AppThunk => (dispatch) => {
    dispatch(setLoadingAC(true))
    reqresAPI.getColors()
        .then((res) => {
            // YYY
            dispatch(getColorsAC(res.data.data))  // my answer
        })
        .catch((e: AxiosError) => {
            dispatch(setError(e.message))
            dispatch(setLoadingAC(false))
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


// COMPONENTS
// Loader
export const Loader = () => {
    return (
        <h1>Loading ...</h1>
    )
}


export const App = () => {
    return (
        <>
            <h1>Reqres API</h1>
            <Users/>
            <Colors/>
        </>
    )
}

const Users = () => {
    const dispatch = useAppDispatch()
    const users = useAppSelector(state => state.app.users)
    const error = useAppSelector(state => state.app.error)
    const isLoading = useAppSelector(state => state.app.isLoading)

    useEffect(() => {
        dispatch(getUsersTC())
    }, [])

    return (
        <div>
            <h2>Users</h2>
            {!!error && <h2 style={{color: 'red'}}>{error}</h2>}
            {isLoading && <Loader/>}
            <div style={{display: 'flex'}}>
                {
                    users.map(u => {
                        return (
                            <div key={u.id} style={{marginRight: '25px'}}>
                                <p>{u.first_name}</p>
                                <img src={u.avatar} alt=""/>
                            </div>
                        )
                    })
                }</div>
        </div>
    )
}

const Colors = () => {
    const dispatch = useAppDispatch()
    const colors = useAppSelector(state => state.app.colors)
    const error = useAppSelector(state => state.app.error)
    const isLoading = useAppSelector(state => state.app.isLoading)

    useEffect(() => {
        dispatch(getColorsTC())
    }, [])

    return (
        <div>
            <h2>Colors</h2>
            {!!error && <h2 style={{color: 'red'}}>{error}</h2>}
            {isLoading && <Loader/>}
            <div style={{display: 'flex'}}>
                {
                    colors.map(c => {
                        return (
                            <div key={c.id} style={{marginRight: '25px'}}>
                                <p>{c.name}</p>
                                <div style={{backgroundColor: c.color, width: '128px', height: '30px'}}>
                                    <b>{c.color}</b>
                                </div>
                            </div>
                        )
                    })
                }</div>
        </div>
    )
}

export const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Provider store={store}> <App/></Provider>)


