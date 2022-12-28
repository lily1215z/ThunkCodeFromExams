// // Email и password менять не надо. Это просто тестовые данные с которыми будет происходить успешный запрос.
// //
// //     Нажмите на кнопку "Залогиниться" и вы увидели alert с успешным сообщением
// //
// // Задача: при успешной логинизации, редиректнуть пользователя на страницу Profile.
// //
// //     Напишите правильную строку кода
// //
// // 🖥 Пример ответа: console.log('If login => redirect to profile')
// import { useFormik } from 'formik';
// import React from 'react'
// import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
// import axios from 'axios';
// import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
// import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
//
//
// // Types
// type LoginFieldsType = {
//     email: string
//     password: string
// }
//
// // API
// const instance = axios.create({baseURL: 'https://exams-frontend.kimitsu.it-incubator.ru/api/'})
//
// const api = {
//     login(data: LoginFieldsType) {
//         return instance.post('auth/login', data)
//     },
// }
//
//
// // Reducer
// const initState = {
//     isLoading: false,
//     error: null as string | null,
//     isLoggedIn: false,
// }
//
// type InitStateType = typeof initState
//
// const appReducer = (state: InitStateType = initState, action: ActionsType): InitStateType => {
//     switch (action.type) {
//         case 'APP/SET-IS-LOGGED-IN':
//             return {...state, isLoggedIn: action.isLoggedIn}
//         case 'APP/IS-LOADING':
//             return {...state, isLoading: action.isLoading}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         default:
//             return state
//     }
// }
//
// // Actions
// const setIsLoggedIn = (isLoggedIn: boolean) => ({type: 'APP/SET-IS-LOGGED-IN', isLoggedIn} as const)
// const setLoadingAC = (isLoading: boolean) => ({type: 'APP/IS-LOADING', isLoading} as const)
// const setError = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
// type ActionsType =
//     | ReturnType<typeof setIsLoggedIn>
//     | ReturnType<typeof setLoadingAC>
//     | ReturnType<typeof setError>
//
//
// // Thunk
// const loginTC = (values: LoginFieldsType): AppThunk => (dispatch) => {
//     dispatch(setLoadingAC(true))
//     api.login(values)
//         .then((res) => {
//             dispatch(setIsLoggedIn(true))
//             alert('Вы залогинились успешно')
//         })
//         .catch((e) => {
//             dispatch(setError(e.response.data.errors))
//         })
//         .finally(() => {
//             dispatch(setLoadingAC(false))
//             setTimeout(() => {
//                 dispatch(setError(null))
//             }, 3000)
//         })
// }
//
// // Store
// const rootReducer = combineReducers({
//     app: appReducer,
// })
//
// export const store = createStore(rootReducer, applyMiddleware(thunk))
// type RootState = ReturnType<typeof store.getState>
// type AppDispatch = ThunkDispatch<RootState, unknown, ActionsType>
// type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, ActionsType>
// const useAppDispatch = () => useDispatch<AppDispatch>()
// const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
//
//
// // Loader
// export const Loader = () => {
//     return <h1>Loading ...</h1>
// }
//
// // Profile
// export const Profile = () => {
//     return <h2>😎 Profile</h2>
// }
//
// // Login
// export const Login = () => {
//
//     const dispatch = useAppDispatch()
//     const navigate = useNavigate()
//
//     const error = useAppSelector(state => state.app.error)
//     const isLoading = useAppSelector(state => state.app.isLoading)
//     const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
//
//     const formik = useFormik({
//         initialValues: {
//             email: 'darrell@gmail.com',
//             password: '123',
//         },
//         onSubmit: values => {
//             dispatch(loginTC(values))
//         }
//     });
//
//     return (
//         <div>
//             {!!error && <h2 style={{color: 'red'}}>{error}</h2>}
//             {isLoading && <Loader/>}
//             <form onSubmit={formik.handleSubmit}>
//                 <div>
//                     <input placeholder={'Введите email'}
//                            {...formik.getFieldProps('email')}/>
//                 </div>
//                 <div>
//                     <input type={'password'}
//                            placeholder={'Введите пароль'}
//                            {...formik.getFieldProps('password')}/>
//                 </div>
//                 <button type="submit">Залогиниться</button>
//             </form>
//         </div>
//     );
// }
//
// // App
// export const App = () => {
//     return (
//         <Routes>
//             <Route path={''} element={<Login/>}/>
//             <Route path={'profile'} element={<Profile/>}/>
//         </Routes>
//     )
// }
//
// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// root.render(<Provider store={store}><BrowserRouter><App/></BrowserRouter></Provider>)
//
//
// // 📜 Описание:
// // ❗ Email и password менять не надо. Это просто тестовые данные с которыми будет происходить успешный запрос.
// // Нажмите на кнопку "Залогиниться" и вы увидели alert с успешным сообщением
// // Задача: при успешной логинизации, редиректнуть пользователя на страницу Profile.
//
// // Напишите правильную строку кода
// // 🖥 Пример ответа:  console.log('If login => redirect to profile')
//


//=== 9 ===
// Задача: напишите в какой последовательности вызовутся числа при успешном запросе.
//     Подсказка: будет 11 чисел.
//     Ответ дайте через пробел.
//
// 🖥 Пример ответа: 1 2 3 4 5 6 7 8 9 1 2
import React, {useEffect} from 'react'
import {Provider, TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import axios from 'axios';

// Utils
console.log = () => {
};

// Api
const instance = axios.create({
    baseURL: 'xxx'
})

const api = {
    getUsers() {
        /* 1 */
        console.log('1')

        return instance.get('xxx')
    }
}


// Reducer
const initState = {
    isLoading: false,
    users: [] as any[]
}

type InitStateType = typeof initState

const appReducer = (state: InitStateType = initState, action: ActionsType): InitStateType => {
    switch (action.type) {
        case 'APP/SET-USERS':
            /* 2 */
            console.log('2')

            return {...state, users: action.users}
        default:
            return state
    }
}

// Actions
const setUsersAC = (users: any[]) => ({type: 'APP/SET-USERS', users} as const)
type ActionsType = ReturnType<typeof setUsersAC>


// Thunk
const getUsersTC = (): AppThunk => (dispatch) => {
    /* 3 */
    console.log('3')

    api.getUsers()
        .then((res) => {
            /* 4 */
            console.log('4')

            dispatch(setUsersAC(res.data.data))
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


// Login
export const Login = () => {

    const users = useAppSelector(state => state.app.users)
    /* 5 */
    console.log('5')


    return (
        <div>
            {/* 6 */}

            {users.map((u) => <p key={u.id}>{u.email}</p>)}
            <h1>В данном задании на экран смотреть не нужно. Рекомендуем взять ручку, листик и последовательно, спокойно
                расставить цифры в нужном порядке. Прежде чем давать ответ обязательно посчитайте к-во цифр и сверьте с
                подсказкой. Удачи 🚀
            </h1>
        </div>
    );
}

// App
export const App = () => {

    /* 7 */
    console.log('7')

    const dispatch = useAppDispatch()

    useEffect(() => {
        /* 8 */

        console.log('8')
        dispatch(getUsersTC())
    }, [])

    /* 9 */
    console.log('9')

    return (
        <Routes>
            <Route path={''} element={<Login/>}/>
        </Routes>
    )
}

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// root.render(<Provider store={store}><BrowserRouter><App/></BrowserRouter></Provider>)

// 📜 Описание:
// Задача: напишите в какой последовательности вызовутся числа при успешном запросе.
// Подсказка: будет 11 чисел.
// Ответ дайте через пробел.

// 🖥 Пример ответа: 1 2 3 4 5 6 7 8 9 1 2