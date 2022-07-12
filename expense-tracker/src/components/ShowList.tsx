import React from "react";
import { useState } from "react";
import IExpense from "../models/IExpense";
import Header from "./common/Header";
import { useEffect } from "react";
import { getDataFromServer } from "../services/Expenses";
import { RouteComponentProps, Link, Route } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
// import ExpensesInfo from "./Expenses/ExpensesInfo";

import './ShowList.css'


function ShowList({ match }: RouteComponentProps) {
    const [items, setItems] = useState<IExpense[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [sum, setSum] = useState<number | null>();
    const [rahulSpent, setRahulSpent] = useState<number>(0);
    const [rameshSpent, setRameshSpent] = useState<number>(0);
    let totalRameshSpent: number = 0;
    let totalRahulSPent: number = 0;

    useEffect(
        () => {
            const fetchData = async () => {
                try {
                    const data = await getDataFromServer();
                    setItems(data);
                    const result = data.reduce(
                        (result, expense) => (result + expense.price), 0)
                    console.log(result)
                    setSum(result);
                    shares(data);
                } catch (error) {
                    setError(error as Error);
                }
            };

            fetchData();
        },
        []
    );


    const shares = (data: IExpense[]) => {
        totalRahulSPent = 0;
        totalRameshSpent = 0;
        data.map(
            (({ payeeName, price }) => (
                ((payeeName === "Rahul") && ((totalRahulSPent += price))) || ((totalRameshSpent += price))
            ))
        )
        setRahulSpent(totalRahulSPent);
        setRameshSpent(totalRameshSpent);
    }

    return (
        <>
            <Header />
            <div style={{ display: "flex" }}>
                <table className="expenseTable">
                    <thead>
                        <tr>
                            <th className="headerCell">Date</th>
                            <th className="headerCell">Product Purchased</th>
                            <th className="headerCell">Price</th>
                            <th className="headerCell">Payee</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            items && items.map(
                                ({ id, date, price, product, payeeName }) => (
                                    <tr key={id}>
                                        <td className="orangeCell">
                                            {date}
                                        </td>
                                        <td className="blueCell">
                                            {product}
                                        </td>
                                        <td className="purpleCell">
                                            {price}
                                        </td>
                                        <td className={(payeeName === "Ramesh" && 'RameshCell') || 'RahulCell'}>
                                            {payeeName}
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
                <div>
                    <Button
                        href={`${match.url}add`}
                        className="btn btn-primary btn-sm"
                        style={{ alignSelf: "flex-start" }}>
                        Add to Expense
                    </Button>

                </div>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td className="blueCell">
                            Total:
                        </td>
                        <td style={{ background: '#82e982' }}>
                            {sum}
                        </td>
                    </tr>
                    <tr>
                        <td className="blueCell">
                            Rahul Paid:
                        </td>
                        <td style={{ background: '#82e9e2' }}>
                            {rahulSpent}
                        </td>
                    </tr>
                    <tr>
                        <td className="blueCell">
                            Ramesh Paid:
                        </td>
                        <td className={(rameshSpent > rahulSpent && 'RameshCell') || 'RahulCell'}>
                            {rameshSpent}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ background: '#d76969' }} >
                            {
                                ((rameshSpent > rahulSpent) && (`Pay Ramesh `)) || (`Pay Rahul `)
                            }
                        </td>
                        <td style={{ background: '#d76969' }}>
                            {Math.abs(rahulSpent - rameshSpent)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>

    )
}

export default ShowList;