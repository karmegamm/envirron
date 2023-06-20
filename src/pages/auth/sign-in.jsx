import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState,useEffect } from "react";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"

export function SignIn() {

  const [credentials, setCredentials] = useState({})
  const [isloading, setIsLoading] = useState(false)
  const [ show, setShow ] = useState(false)

  const handleShowPassword = () => {
    setShow(!show)
    console.log(show);
    var password = document.querySelector("input[name='password']")
    if(show)
      password.type = "password"
    else
      password.type = "text"
  }

  useEffect(() => {
    var email = localStorage.getItem("email");
    var password = localStorage.getItem("password");
    if (email && password) {
      submitCredentials({email, password, rememberme : true});
    }
    else{
      email = sessionStorage.getItem("email");
      password = sessionStorage.getItem("password");
      if(email && password)
      submitCredentials({email, password, rememberme : true});
    }
  }, [])

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.name === "rememberme" ? e.target.checked : e.target.value
    })
    console.log(credentials);
  }
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    submitCredentials(credentials)
  }
  
  const submitCredentials = ({email,password,rememberme}) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(email == "" || email == undefined || !emailRegex.test(email))
      Swal.fire("Please Enter Valid Email!")
    else if(password == "" || password == undefined)
      Swal.fire("Password Field is Empty")
    else
    {
      setIsLoading(true)
      fetch("http://localhost:3000/login",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password,rememberme})
      }).then(res => res.json())
      .then(data => {
        console.log(data)
        setIsLoading(false)
        if(data.login)
        {
          if(data.role === "supervisor"){
            setIsLoading(true)
            fetch("http://localhost:3000/issupervisorfree",{
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body : JSON.stringify({name: data.user.name})
            }).then(res => res.json())
            .then(dat => {
              setIsLoading(false)
              if(dat.result){
                Swal.fire({
                  icon: "warning",
                  title: "You are Not Allocated!",
                  text: "You aren't allocated to any project.\nPlease contact Admin!",
                }).then(() => {
                  document.querySelectorAll("input").forEach(input => input.value = "")
                })
              }
              else{
                sessionStorage.setItem(`role`, data.user.designation)
                sessionStorage.setItem(`name`, data.user.name)
                sessionStorage.setItem(`email`, email)
                sessionStorage.setItem(`password`, password)
                if(rememberme) {
                  localStorage.setItem(`email`, email)
                  localStorage.setItem(`password`, password)
                  localStorage.setItem("designation", data.role)
                }
                else
                {
                  localStorage.removeItem(`designation`)
                  localStorage.removeItem(`email`)
                  localStorage.removeItem(`password`)
                }
                navigate("/dashboard/home")
              }
            })
          }
          else{
            sessionStorage.setItem(`role`, data.user.designation)
            sessionStorage.setItem(`name`, data.user.name)
            sessionStorage.setItem(`email`, email)
            sessionStorage.setItem(`password`, password)
            if(rememberme) {
              localStorage.setItem(`email`, email)
              localStorage.setItem(`password`, password)
              localStorage.setItem("designation", data.role)
            }
            else
            {
              localStorage.removeItem(`designation`)
              localStorage.removeItem(`email`)
              localStorage.removeItem(`password`)
            }
            navigate("/dashboard/home")
          }
        }
        else {
          Swal.fire("Wrong credentials!")
          document.querySelectorAll("input").forEach(input => input.value = "");        
        }
          setCredentials({})
        })
    .catch(err => {
      console.log(err)
      setIsLoading(false)
      document.querySelectorAll("input").forEach(input => input.value = "");
      setCredentials({})
      Swal.fire("Server Down!")
    })
  }
  }

  return (
    <>
      <img
        src="/img/authbg.jpg"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input type="email" label="Email" size="lg" name="email" onChange={handleChange} />
            {/*<Input type="password" label="Password" size="lg" name="password" onChange={handleChange} />
            {show ? <EyeIcon stroke="2" className="w-5 h-5"/> :
            <EyeSlashIcon stroke="2" className="w-5 h-5"/>} */}
            <div className="relative">
              <Input type="password" label="Password" size="lg" name="password" onChange={handleChange} />
              {show ? (
                <EyeIcon
                  stroke="2"
                  onClick={handleShowPassword}
                  className="w-5 h-5 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  />
              ) : (
                <EyeSlashIcon
                  stroke="2"
                  onClick={handleShowPassword}
                  className="w-5 h-5 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                />
              )}
            </div>

            <div className="-ml-2.5">
              <Checkbox label="Rememberme" name="rememberme" onChange={handleChange} />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            {isloading ? <ReactLoading type={"spinningBubbles"} color={"lightblue"} height={50} width={50} className="ml-36"/>
            : <Button variant="gradient" fullWidth onClick={handleSubmit}>
              Sign In
            </Button>}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
