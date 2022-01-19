const initialData= {
    loading:false,
    data:{},
}
const userById =(state = initialData,action)=>{
    switch(action.type)
    {
        case 'USER_BY_ID_LOADING':
            return {
                ...state,
                loading:action.payload,
            }
        case 'SET_USER_BY_ID':
            return {
                ...state,
                data:action.payload,
            }
        default:
            return state;
    }
}
export default userById;