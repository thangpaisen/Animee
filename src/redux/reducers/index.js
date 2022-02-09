import { combineReducers } from 'redux'
import user from './user';
import userById from './userById';
import listPostByUser from './listPostByUser';
import listAllPost from './listAllPost';
import countLoadAdmob from './countLoadAdmob';

const rootReducer  = combineReducers({
    user,
    userById,
    listPostByUser,
    listAllPost,
    countLoadAdmob,
})

export default rootReducer;