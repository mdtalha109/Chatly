import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import axios from 'axios'
import Input from '../../components/ui/Input/input'
import Button from '../../components/ui/Button'
import { BaseConfig } from '../../config/baseConfig'

const SignupPage = () => {
    const toast = useToast()

    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [pic, setPic] = useState('')
    const [loading, setloading] = useState(false)
    

    const postDetails = (pic) => {
        setloading(true);
       
        if(pic === undefined){
            toast({
                title: 'oops!',
                description: "Please upload your profile pic!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
              })
            return;
        }

        if(pic.type.startsWith('image/')){
            const data = new FormData()
            data.append("file", pic)
            data.append("upload_preset", "chatly")
            data.append("cloud_name", "talhapro321")
            fetch(BaseConfig.CLOUDINARY_URL, {
                method: "POST",
                body: data
            }).then((res) => res.json())
              .then(data => {
                
                setPic(data.url.toString())
                console.log(data)
                setloading(false)
              })
              .catch((err) => {
                  console.log(err)
                  setloading(false)
              })
        } else{
            setloading(false);
            toast({
                title: 'oops!',
                description: "Media type not allowed",
                status: 'warning',
                duration: 5000,
                isClosable: true,
              })
        }
        
    }

    const submitHandler = async(e) => {
        e.preventDefault();
        if(!name || !email || !password || !confirmPassword || !pic){
            toast({
                title: 'oops!',
                description: "Please fill all the fields!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
              })
              return
        }

        if(password !== confirmPassword){
            toast({
                title: 'oops!',
                description: "Password not matched!",
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
              return
        }

        try{
            const config = {
                headers: {
                  "Content-type": "application/json",
                },
              };    
            const {data} = await axios.post(`${BaseConfig.BASE_API_URL}/user`, {name, email, password, pic}, config)

            toast({
                title: 'Congratulations!',
                description: "Account created successfully!",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

            
            localStorage.setItem('suerInfo', JSON.stringify(data))

        }catch (err){
            console.log(err.response.data)
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
        <div className='flex justify-center items-center bg-blue-500 h-screen w-screen'>
        <form className="flex flex-col gap-4 p-4 md:w-[30%] bg-white shadow-lg rounded-xl">
        <h3 className='text-2xl mb-2 font-bold'>Register</h3>
            <Input 
                type="text" 
                label="Name" 
                id="userName"
                placeholder="name"
                value={name} 
                onChange={(e)=> setname(e.target.value)}
                data-testid="user_name_input"
            />

            <Input 
                type="email" 
                label="Email" 
                id="userEmail"
                placeholder="email address"
                value={email} 
                onChange={(e)=> setemail(e.target.value)}
                data-testid="user_email_input"
            />

            <Input 
                type="password" 
                label="Password" 
                id="password"
                placeholder="password"
                value={password} 
                onChange={(e)=> setpassword(e.target.value)}
                data-testid="user_password_input"
            />

            <Input 
                type="password" 
                label="Confirm Password" 
                id="confirm_password"
                placeholder="Confirm password"
                value={confirmPassword} 
                onChange={(e)=> setconfirmPassword(e.target.value)}
                data-testid="user_confirm_password_input"
            />
            <Input 
                type="file" 
                label="Profile Picture"
                placeholder="Upload your profile picture"
                data-testid="user_profile_pic"
                onChange={(e) => postDetails(e.target.files[0])}
            />
            <Button onClick={submitHandler} role='Button'>
               {loading ? <Spinner/> : "Create Account"} 
            </Button>
            <p className="text-center">Already registered? <Link to="/">Login</Link></p>
        </form>
        </div>
    )
}

export default SignupPage
