const initialData= {
    loading:false,
    data:null,
}
const user =(state = initialData,action)=>{
    switch(action.type)
    {
        case 'USER_LOADING':
            return {
                ...state,
                loading:action.payload,
            }
        case 'SET_USER':
            return {
                ...state,
                data:action.payload,
            }
        default:
            return state;
    }
}
export default user;