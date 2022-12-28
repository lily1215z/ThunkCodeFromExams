

// ==================== Чт-3(2)

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import axios from 'axios';


// Types
type TodoDomainType = TodoType & {
    isDisabled: boolean
}

type TodoType = {
    id: number
    title: string
    completed: boolean
    userId: number
}

// Api
const instance = axios.create({baseURL: 'https://jsonplaceholder.typicode.com/'})

const todosAPI = {
    getTodos() {
        return instance.get('todos?_limit=15')
    },
    async deleteTodo(id: number) {
        // Имитация длительного запроса, чтобы была видна крутилка
        await new Promise(resolve => setTimeout(resolve, 3000));
        return instance.delete(`todos/${id}`)
    }
}


// Reducer
const initState = {
    isLoading: false,
    todos: [] as TodoDomainType[]
}

type InitStateType = typeof initState

const todosReducer = (state: InitStateType = initState, action: ActionsType): InitStateType => {
    switch (action.type) {
        case 'TODOS/GET-TODOS':
            return {
                ...state, todos: action.todos.map(t => {
                    return {...t, isDisabled: false}
                })
            }

        case 'TODOS/DELETE-TODO':
            return {...state, todos: state.todos.filter(t => t.id !== action.id)}

        case 'TODOS/IS-LOADING':
            return {...state, isLoading: action.isLoading}

        case 'TODOS/IS-DISABLED':
            return {
                ...state, todos: state.todos.map((t) => {
                    if (t.id === action.id) {
                        return {...t, isDisabled: action.isDisabled}
                    } else {
                        return t
                    }
                })
            }

        default:
            return state
    }
}

const getTodosAC = (todos: TodoType[]) => ({type: 'TODOS/GET-TODOS', todos} as const)
const deleteTodoAC = (id: number) => ({type: 'TODOS/DELETE-TODO', id} as const)
const setLoadingAC = (isLoading: boolean) => ({type: 'TODOS/IS-LOADING', isLoading} as const)
const setIsDisabled = (isDisabled: boolean, id: number) => ({type: 'TODOS/IS-DISABLED', isDisabled, id} as const)
type ActionsType =
    | ReturnType<typeof getTodosAC>
    | ReturnType<typeof deleteTodoAC>
    | ReturnType<typeof setLoadingAC>
    | ReturnType<typeof setIsDisabled>

// Thunk
const getTodosTC = (): AppThunk => (dispatch) => {
    todosAPI.getTodos()
        .then((res) => {
            dispatch(getTodosAC(res.data))
        })
}

const deleteTodoTC = (id: number): AppThunk => (dispatch) => {
    dispatch(setIsDisabled(true, id))
    dispatch(setLoadingAC(true))
    todosAPI.deleteTodo(id)
        .then((res) => {
            dispatch(deleteTodoAC(id))
            dispatch(setLoadingAC(false))
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


// Loader
export const Loader = () => {
    return (
        <h1>Loading ...</h1>
    )
}

// App
const App = () => {
    const dispatch = useAppDispatch()
    const todos = useAppSelector(state => state.todos.todos)
    const isLoading = useAppSelector(state => state.todos.isLoading)

    useEffect(() => {
        dispatch(getTodosTC())
    }, [])

    const deleteTodoHandler = (id: number) => {
        dispatch(deleteTodoTC(id))
    };

    return (
        <div>
            <div style={{position: 'absolute', top: '0px'}}>
                {isLoading && <Loader/>}
            </div>
            <div style={{marginTop: '100px'}}>
                <h2>✅ Список тудулистов</h2>
                {
                    todos.map((t) => {
                        return (
                            <div style={t.completed ? {color: 'grey'} : {}} key={t.id}>
                                <input type="checkbox" defaultChecked={t.completed}/>
                                <b>Описание</b>: {t.title}
                                <button
                                    disabled={t.isDisabled === true}  //was my answer
                                    style={{marginLeft: '20px'}}
                                    onClick={() => deleteTodoHandler(t.id)}>
                                    Удалить тудулист
                                </button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Provider store={store}> <App/></Provider>)