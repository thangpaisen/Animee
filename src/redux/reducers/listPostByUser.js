const initialData= {
    loading:false,
    data:[],
}
const listPostByUser =(state = initialData,action)=>{
    switch(action.type)
    {
        case 'LIST_POST_BY_USER_LOADING':
            return {
                ...state,
                loading:action.payload,
            }
        case 'SET_LIST_POST_BY_USER':
            return {
                ...state,
                data:action.payload,
            }
        default:
            return state;
    }
}
export default listPostByUser;