import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import axios from 'axios'
import './HomePage.css'


const HomePage = () => {

    const toast = useToast()
    const navigate = useNavigate()

    //if user is already logged in, navigate user to chat page
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
            const {data} = await axios.post("https://chatly-realtime-chat.herokuapp.com/api/user/login", { email, password}, config)
            setloading(false)
            
            if(data){
                toast({
                    title: 'Congratulations!',
                    description: "Login Successfull!",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })

                localStorage.setItem('userInfo', JSON.stringify(data));
                navigate('/chat')
            }
        }catch(err){  
            setloading(false)  
            toast({
                title: 'Sorry!',
                description: err.response.data.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
        }  
    }


    return (
        <div className='home-container'>
            <form className="register-form">
                <input 
                    type="text" 
                    placeholder="email address"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                />
                <button onClick={submitHandler} >  {loading ? <Spinner/> : "Login"}    </button>
                <p className="message">New User? <Link to="/signup">Create your account</Link></p>
            </form> 
        </div>
    )
}

export default HomePage
