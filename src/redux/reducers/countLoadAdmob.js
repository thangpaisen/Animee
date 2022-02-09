
const countLoadAdmob =(state = 0,action)=>{
    switch(action.type)
    {
        case 'INCREMENT':
            return state+1;
        case 'ZERO':
            return 0;
        default:
            return state;
    }
}
export default countLoadAdmob;