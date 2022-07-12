import { parse } from "node:path/win32";
import React, { Component } from "react";
import { Row, Col, Form, Button, ToastContainer, Toast } from "react-bootstrap";
import { pushDataToServer } from "../../services/Expenses";

import './AddExpenseItem.css'

type Props = {
    id: number
};

type State = {
    values: {
        payeeName: string,
        price: number,
        date: string,
        product: string
    },
    errors: {
        payeeName: string[],
        price: string[],
        date: string[],
        product: string[]
    },
    isValid: Boolean,
    responseState: 'initial' | 'success' | 'error',
    toastMessage: string,
    show: boolean
}

class AddExpenseItem extends Component<Props, State>{
    state: State = {
        values: {
            payeeName: '-1',
            price: 0,
            date: '',
            product: ''
        },
        errors: {
            payeeName: [],
            price: [],
            date: [],
            product: []
        },
        isValid: false,
        responseState: 'initial',
        toastMessage: '',
        show: false
    }

    validate(nameOfInput?: keyof State['values']) {
        const errors: State["errors"] = {
            payeeName: [],
            price: [],
            date: [],
            product: []
        };
        let isValid = true;

        const {
            payeeName,
            price,
            product,
            date
        } = this.state.values;

        if (payeeName === "-1") {
            errors.payeeName.push("Please select a valid Payee");
            isValid = false;
        }

        const pricePat = /^\d+(\.\d{1,2})?$/;
        if (price === 0) {
            errors.price.push("Please select a non zero value");
            isValid = false;
        }
        if (!pricePat.test(price.toString())) {
            errors.price.push("Please enter decimal value for price");
            isValid = false;
        }
        if (product.trim() === "") {
            errors.product.push("Please select a valid product");
            isValid = false;
        }
        // console.log(date);
        if (date.trim() === "") {
            errors.date.push("Please select a valid date");
            isValid = false;
        }
        if (nameOfInput) {
            this.setState(
                state => {
                    return {
                        errors: {
                            ...state.errors,
                            [nameOfInput]: errors[nameOfInput]
                        },
                        isValid
                    }
                }
            );
            return errors[nameOfInput].length === 0;
        } else {
            this.setState(
                {
                    errors,
                    isValid
                }
            );

            return isValid;
        }
    }

    updateValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        this.setState(
            state => {
                return {
                    values: {
                        ...this.state.values,
                        [name]: value
                    }
                }
            }, () => {
                this.validate(name as keyof State["values"])
                // console.log(name,value)
            }
        )
        // console.log(this.state);

    }

    addExpenseToList = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!this.validate()) {
            return;
        }
        const expenseItem = {
            ...this.state.values,
            id: this.props.id,
            price: Number(this.state.values.price)
        };
        try {
            this.setState({
                responseState: "initial"
            })
            const data = await pushDataToServer(expenseItem)

            this.setState({
                responseState: "success",
                show: true,
                toastMessage: `Expense added with id:${data.id} successfully`
            })
        } catch (error) {
            this.setState({
                responseState: 'error',
                toastMessage: (error as Error).message,
                show: true
            });
        }

    }

    render() {
        const {
            payeeName,
            product,
            price,
            date
        } = this.state.values;

        const {
            payeeName: payeeErrors,
            product: productErrors,
            price: priceErrors,
            date: dateErrors
        } = this.state.errors;

        const isValid = this.state.isValid;
        const { responseState, toastMessage, show } = this.state;


        return (
            <>
                <Row>
                    <Col xs={12}>
                        <h3>Add Expense</h3>
                    </Col>
                    <Col xs={12}>
                        <Form onSubmit={this.addExpenseToList}>
                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="payeeName"
                            >
                                <Form.Label>Payee Name</Form.Label>
                                <Col xs={12}>
                                    <Form.Select
                                        name="payeeName"
                                        value={payeeName}
                                        onChange={this.updateValue}
                                        aria-describedby="payeeHelp"
                                        isInvalid={payeeErrors.length !== 0}
                                    >
                                        <option value={-1}>Choose a Payee</option>
                                        <option value="Rahul">Rahul</option>
                                        <option value="Ramesh">Ramesh</option>
                                    </Form.Select>
                                    <Form.Text id="payeeHelp" muted>
                                        Name of the Payee
                                    </Form.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {
                                            payeeErrors.map(
                                                err => <div key={err}>{err}</div>
                                            )
                                        }
                                    </Form.Control.Feedback>
                                </Col>

                            </Form.Group>


                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="product"
                            >
                                <Form.Label>Product</Form.Label>
                                <Col sm={12}>
                                    <Form.Control
                                        type="text"
                                        name="product"
                                        value={product}
                                        onChange={this.updateValue}
                                        aria-describedby="productHelp"
                                        isInvalid={productErrors.length !== 0}
                                    />
                                    <Form.Text id="productHelp" muted>
                                        Name of Product
                                    </Form.Text>
                                </Col>
                                <Form.Control.Feedback type="invalid">
                                    {
                                        productErrors.map(
                                            err => <div key={err}>{err}</div>
                                        )
                                    }
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="price"
                            >
                                <Form.Label>Price</Form.Label>
                                <Col sm={12}>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={price}
                                        onChange={this.updateValue}
                                        aria-describedby="priceHelp"
                                        isInvalid={priceErrors.length !== 0}
                                    />
                                    <Form.Text id="priceHelp" muted>
                                        Value of product
                                    </Form.Text>
                                </Col>
                                <Form.Control.Feedback type="invalid">
                                    {
                                        priceErrors.map(
                                            err => <div key={err}>{err}</div>
                                        )
                                    }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="date"
                            >
                                <Form.Label>Date</Form.Label>
                                <Col sm={12}>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={date}
                                        onChange={this.updateValue}
                                        aria-describedby="dateHelp"
                                        isInvalid={dateErrors.length !== 0}
                                    />
                                    <Form.Text id="dateHelp" muted>
                                        Date of expense
                                    </Form.Text>
                                </Col>
                                <Form.Control.Feedback type="invalid">
                                    {
                                        dateErrors.map(
                                            err => <div key={err}>{err}</div>
                                        )
                                    }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                                as={Row}
                                className="my-3"
                                controlId="button"
                            >
                                <Col sm={{ offset: 4, span: 9 }}>
                                    <Button type="submit" disabled={!isValid} style={{ padding: "10px 20px" }}>Add Expense</Button>
                                    <Button href="/" style={{ marginLeft: "20px", padding: "10px 20px" }}>Back</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>

                </Row>
                {
                    responseState !== 'initial' && (
                        <ToastContainer className="p-3" position="top-end">
                            <Toast
                                bg={responseState === 'success' ? 'success' : 'danger'}
                                show={show}
                                autohide
                                delay={5000}
                                onClose={() => this.setState({ show: false })}
                            >
                                <Toast.Header closeButton={false}>
                                    {responseState === 'success' ? 'Success' : 'Error'}
                                </Toast.Header>
                                <Toast.Body>
                                    {toastMessage}
                                </Toast.Body>
                            </Toast>
                        </ToastContainer>
                    )
                }
            </>
        )
    }
}

export default AddExpenseItem;