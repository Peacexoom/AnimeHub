import { extendObservable } from 'mobx';

export default class UserStore {
    constructor(){
        extendObservable(this,{
            loading : true,
            IsLoggedIn : false,
            username : ' '
        })
    }
}
