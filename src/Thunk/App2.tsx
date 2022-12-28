import React, { useEffect } from 'react'
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import axios from 'axios';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

// ==================== Чт-2(2)

// Types
type TodoType = {
    id: number
    title: string
    completed: boolean
    userId: number
}

// Api
const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com/'
})

const todosAPI = {
    getTodos() {
        return instance.get<TodoType[]>('todos?_limit=15')
    },
    changeTodoStatus(id: number, completed: boolean) {
        return instance.patch(`todos/${id}`, {completed})
    }
}


// Reducer
const initState = [] as TodoType[]

type InitStateType = typeof initState

const todosReducer = (state: InitStateType = initState, action: ActionsType) => {
    switch (action.type) {
        case 'TODOS/GET-TODOS':
            return action.todos

        case 'TODOS/CHANGE-TODO-STATUS':
            return state.map((t) => {
                if (t.id === action.todo.id) {
                    return {...t, completed: action.todo.completed}
                } else {
                    return t
                }
            })

        default:
            return state
    }
}

const getTodosAC = (todos: TodoType[]) => ({type: 'TODOS/GET-TODOS', todos} as const)
const changeTodoStatusAC = (todo: TodoType) => ({type: 'TODOS/CHANGE-TODO-STATUS', todo} as const)
type ActionsType = ReturnType<typeof getTodosAC> | ReturnType<typeof changeTodoStatusAC>

// Thunk
const getPostsTC = (): AppThunk => (dispatch) => {
    todosAPI.getTodos()
        .then((res) => {
            dispatch(getTodosAC(res.data))
        })
}

const changeTodoStatusTC = (id: number, completed: boolean): AppThunk => (dispatch) => {
    todosAPI.changeTodoStatus(id, completed)
        .then((res) => {
            dispatch(changeTodoStatusAC(res.data))
        })
}

// Store
const rootReducer = combineReducers({
    todos: todosReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))
type RootState = ReturnType<typeof store.getState>
type AppDispatch = ThunkDispatch<RootState, unknown, ActionsType>
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, ActionsType>
const useAppDispatch = () => useDispatch<AppDispatch>()
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// App
export const App2 = () => {
    const dispatch = useAppDispatch()
    const todos = useAppSelector(state => state.todos)

    useEffect(() => {
        dispatch(getPostsTC())
    }, [])

    const changeStatusHandler = (id: number, completed: boolean) => {
        dispatch(changeTodoStatusTC(id, completed))
    };

    return (
        <>
            <h2>✅ Список тудулистов</h2>
            {
                todos.length ?

                    todos.map((t) => {
                        return (
                            <div style={t.completed ? {color: 'grey'} : {}} key={t.id}>
                                <input type="checkbox"
                                       checked={t.completed}
                                       onChange={() => changeStatusHandler(t.id, !t.completed)}
                                />
                                <b>Описание</b>: {t.title}
                            </div>
                        )
                    })
                    : <h2>Тудулистов нету 😥</h2>
            }
        </>
    )
}


