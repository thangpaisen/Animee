import { combineReducers } from 'redux'
import user from './user';
import userById from './userById';
import listPostByUser from './listPostByUser';
import listAllPost from './listAllPost';

const rootReducer  = combineReducers({
    user,
    userById,
    listPostByUser,
    listAllPost,
})

export default rootReducer;