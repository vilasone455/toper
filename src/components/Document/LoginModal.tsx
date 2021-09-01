import React, { FunctionComponent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Checkbox, Form, Modal } from 'semantic-ui-react'
import { LoginPayload } from '../../interface/loginpayload'

import { defaultUser } from '../../interface/user'

import { signIn, signOut } from '../../reducer/auth/thunkaction'

import { initApp } from '../../reducer/loadapp'

interface LoginModalProp {
    isLogin: boolean
}

export const LoginModal: FunctionComponent<LoginModalProp> = ({ isLogin }) => {

    const dispatch = useDispatch()

    const [userName, setuserName] = useState("")

    const [userPassword, setuserPassword] = useState("")

    const onLogin = async () => {
        /*
        let loginParam: LoginPayload = {
            userName: userName,
            userPassword: userPassword
        }
        await dispatch(signIn(loginParam))
        dispatch(initApp())
        */
    }


    return (
        <Modal
            open={!isLogin}
            header='Sign In'
        >
            <Form>
                <Form.Field>
                    <label>First Name</label>
                    <input placeholder="Enter name" onChange={(e) => setuserName(e.target.value)} value={userName} />
                </Form.Field>
                <Form.Field>
                    <label>Last Name</label>
                    <input placeholder="Enter password" onChange={(e) => setuserPassword(e.target.value)} value={userPassword} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                <Button type='submit' onClick={onLogin}>Submit</Button>
            </Form>
        </Modal>

    )

}


export default LoginModal