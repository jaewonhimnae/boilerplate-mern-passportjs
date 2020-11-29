import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import md5 from "md5";
import { Link } from "react-router-dom";
import Axios from "axios";

function RegisterPage(props) {

  const { register, handleSubmit, watch, errors } = useForm();
  const password = useRef();
  password.current = watch("password");
  const [errorsFromSubmit, setErrorsFromSubmit] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    const body = {
      email: data.email,
      name: data.name,
      password: data.password,
      image: `http://gravatar.com/avatar/${md5(
        data.email
      )}?d=identicon`
    }

    try {
      setLoading(true)
      await Axios.post(`/api/users/register`, body)
      props.history.push("/login");
      setLoading(false)
    } catch (error) {
      setErrorsFromSubmit(error.message)
      setLoading(false)
      setTimeout(() => {
        setErrorsFromSubmit("")
      }, 5000);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form">
        <div style={{ textAlign: 'center' }}>
          <h3>Register</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            ref={register({ required: true, pattern: /^\S+@\S+$/i })}
          />
          {errors.email && <p>This email field is required</p>}

          <label>Name</label>
          <input
            name="name"
            ref={register({ required: true, maxLength: 10 })}
          />
          {errors.name && errors.name.type === "required"
            && <p> This name field is required</p>}
          {errors.name && errors.name.type === "maxLength"
            && <p> Your input exceed maximum length</p>}

          <label>Password</label>
          <input
            name="password"
            type="password"
            ref={register({ required: true, minLength: 6 })}
          />
          {errors.password && errors.password.type === "required"
            && <p> This name field is required</p>}
          {errors.password && errors.password.type === "minLength"
            && <p> Password must have at least 6 characters</p>}

          <label>Password Confirm</label>
          <input
            type="password"
            name="password_confirm"
            ref={register({
              required: true,
              validate: (value) =>
                value === password.current
            })}
          />
          {errors.password_confirm && errors.password_confirm.type === "required"
            && <p> This password confirm field is required</p>}
          {errors.password_confirm && errors.password_confirm.type === "validate"
            && <p>The passwords do not match</p>}

          {errorsFromSubmit &&
            <p>{errorsFromSubmit}</p>
          }

          <input type="submit"
            style={{ marginTop: '40px' }}
            disabled={loading} />

        </form>
        <Link style={{ color: 'gray', textDecoration: 'none' }} to="/login">To login....</Link>
      </div>
    </div >
  )
}

export default RegisterPage

