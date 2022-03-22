import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import axios from 'axios'
import './SignupPage.css'

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

        if(pic.type  === "Image/jpeg" || "Image/png"){
            const data = new FormData()
            data.append("file", pic)
            data.append("upload_preset", "chatly")
            data.append("cloud_name", "talhapro321")
            fetch("https://api.cloudinary.com/v1_1/talhapro321/image/upload", {
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
            console.log("else part")
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
            const {data} = await axios.post("https://chatly-realtime-chat.herokuapp.com/api/user", {name, email, password, pic}, config)
            toast({
                title: 'Congratulations!',
                description: "Account created successfully!",
                status: 'success',
                duration: 5000,
                isClosable: true,
              })

            
            localStorage.setItem('suerInfo', JSON.stringify(data))

        }catch (err){
            // console.log(err.response.data)
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
                placeholder="name" 
                value={name} 
                onChange={(e)=> setname(e.target.value)}
            />

            <input 
                type="email" 
                placeholder="email address"
                value={email} 
                onChange={(e)=> setemail(e.target.value)}
            />

            <input 
                type="password" 
                placeholder="password"
                value={password} 
                onChange={(e)=> setpassword(e.target.value)
            }/>

            <input 
                type="password" 
                placeholder="Confirm password"
                value={confirmPassword} 
                onChange={(e)=> setconfirmPassword(e.target.value)}
            />
            <input 
                type="file" 
                placeholder="Upload your profile picture"
                
                onChange={(e) => postDetails(e.target.files[0])}
            />
            <button onClick={submitHandler}>
               {loading ? <Spinner/> : "Create Account"} 
            </button>
            <p className="message">Already registered? <Link to="/">Login</Link></p>
        </form>
        </div>
    )
}

export default SignupPage
