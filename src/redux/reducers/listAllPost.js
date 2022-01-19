const initialData= {
    loading:false,
    data:[],
}
const listAllPost =(state = initialData,action)=>{
    switch(action.type)
    {
        case 'LIST_ALL_POST_LOADING':
            return {
                ...state,
                loading:action.payload,
            }
        case 'SET_LIST_ALL_POST':
            return {
                ...state,
                data:action.payload,
            }
        default:
            return state;
    }
}
export default listAllPost;