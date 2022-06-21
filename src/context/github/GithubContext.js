import { createContext, useReducer } from "react";
import githubReducer from './GithubReducer'

const GithubContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({ children }) => {
    
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false
    }

   const [state, dispatch] = useReducer(githubReducer, initialState)

   //Get initial users (testing pourposes)
    const fetchUsers = async () =>{
        setLoading()
        const res = await fetch(`${GITHUB_URL}/users`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        })
        const data = await res.json()
        dispatch({
            type: 'GET_USERS',
            payload: data,
        })
    }

    //Get search Results
    //!!! FUNCTION MOVED IN GithubActions.js !!!
    const searchUsers = async (text) =>{

        const params = new URLSearchParams({
            q: text
        })

        setLoading()
        const res = await fetch(`${GITHUB_URL}/search/users?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        })
        const {items} = await res.json()
        dispatch({
            type: 'GET_USERS',
            payload: items,
        })
    }

    //Get single user profile
    // !!! FUNCTION MOVED IN  GithubActions.js !!!
    const getUser = async (login) =>{

        setLoading()
        const res = await fetch(`${GITHUB_URL}/users/${login}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        })

        if(res.status === 404){
            window.location = '/notfound'
        }else{
            
            const data = await res.json()
            dispatch({
                type: 'GET_USER',
                payload: data,
            })
        }
    }

    //Get User Repositories
 // !!! FUNCTION MOVED IN  GithubActions.js !!!
    const getUsersRepos = async (login) =>{

        setLoading()

        const params = new URLSearchParams({
            sort: 'created',
            per_page: 10,
        })

        const res = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        })
        const data = await res.json()
        dispatch({
            type: 'GET_REPOS',
            payload: data,
        })
    }

    //Clear Users From state
    const clearUsers = () => dispatch({type: 'CLEAR_USERS'})

   

    //Set Loading 
    const setLoading = () => dispatch({type: 'SET_LOADING'})

    return<GithubContext.Provider value={{
        // ...state, Short cut for the first 4 lines os state
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        dispatch,
        searchUsers,
        clearUsers,
        fetchUsers,
        getUser,
        getUsersRepos,
    }}>
        {children}
    </GithubContext.Provider>
}

export default GithubContext