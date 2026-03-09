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
    const userInfoString = localStorage.getItem('userInfo');
    if(userInfoString){
      const userInfo = JSON.parse(userInfoString);
      if(userInfo){
        navigate('/chat');
      }
    }
  }, [navigate]);

  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [loading, setloading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

      const {data} = await axios.post(`${BaseConfig.BASE_API_URL}/user/login`, 
        { email, password}, 
        config
      )

      console.log("data: ", data?.data)

      setloading(false)

      if(data){
        toast({
          title: 'Congratulations!',
          description: "Login Successfull!",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        localStorage.setItem('userInfo', JSON.stringify(data?.data));
        navigate('/chat')
      }
    }catch(err){
      setloading(false)
      toast({
        title: 'Sorry!',
        description: err?.response?.data?.message || 'Something went wrong, please try again',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">

      <div className="relative w-full max-w-md">
        <div className="bg-white/80  rounded-2xl p-8 shadow-2xl space-y-2 border border-gray-200">
          {/* Header */}
          <div className="text-center space-y-2">
          
            <h1 className="text-3xl font-bold  text-black">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Email Address
                </label>
             
                
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className=" w-full"
                    disabled={loading}
                  />
               
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Password
                </label>
                <div className="relative">
                
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className="w-full"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HomePage