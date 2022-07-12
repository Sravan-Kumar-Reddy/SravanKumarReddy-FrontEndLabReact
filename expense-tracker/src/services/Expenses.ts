import axios from 'axios';
import IExpense from '../models/IExpense';

const getDataFromServer = () => {
    return axios.get<IExpense[]>("http://localhost:3001/items")
        .then(response => response.data);
}

const pushDataToServer = (newPurchase: Omit<IExpense, 'id'>) => {
    return axios.post<IExpense>("http://localhost:3001/items", newPurchase, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data);
}

export { getDataFromServer, pushDataToServer }