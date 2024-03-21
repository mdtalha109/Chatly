import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import axios from 'axios'
import Input from '../../components/ui/Input/input'
import Button from '../../components/ui/Button'
import { BaseConfig } from '../../config/baseConfig'


const HomePage = () => {

    const toast = useToast()
    const navigate = useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) 
        if(userInfo){
            navigate('/chat')
        }
    }, [navigate]);

    
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [loading, setloading] = useState(false)

    const submitHandler = async(e) => {
        e.preventDefault();
        setloading(true)
        if(!email || !password ){
            toast({
                title: 'oops!',
                description: "Please fill all the fields!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
              })
              setloading(false)
              return
        }

        try{
            const config = {
                headers: {
                  "Content-type": "application/json",
                },
              };    
            const {data} = await axios.post(`${BaseConfig.BASE_API_URL}/user/login`, { email, password}, config)
            
            setloading(false)
            
            if(data){
                toast({
                    title: 'Congratulations!',
                    description: "Login Successfull!",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })

                localStorage.setItem('userInfo', JSON.stringify(data.data));
                navigate('/chat')
            }
        }catch(err){  
            setloading(false)  
            toast({
                title: 'Sorry!',
                description: err?.response?.data?.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
        }  
    }


    return (
        <div className='flex justify-center items-center bg-blue-500 h-screen w-screen'>
            
            <form className="flex flex-col gap-4 p-4 md:w-[20%] bg-white shadow-lg rounded-xl">
                <h3 className='text-2xl mb-2 font-bold'>Login</h3>
                <Input 
                    id="user_email"
                    type="text" 
                    label="Email"
                    placeholder="email address"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                />
                <Input 
                    id="user_password"
                    type="password" 
                    label="Password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                />
                <Button onClick={submitHandler} >  {loading ? <Spinner/> : "LOGIN"}  </Button>
                <p className="text-center">New User? <Link to="/signup">Create your account</Link></p>
            </form> 
        </div>
    )
}

export default HomePage
