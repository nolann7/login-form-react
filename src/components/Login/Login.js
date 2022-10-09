import React, {
  useState,
  useReducer,
  useEffect,
  useContext,
  useRef,
} from 'react';

import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';
import classes from './Login.module.css';

const emailReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
      return { value: action.val, isValid: action.val.includes('@') };
    case 'INPUT_BLUR':
      return { value: state.value, isValid: state.value.includes('@') };
    default:
      throw new Error();
  }
  // if (action.type === 'USER_INPUT') {
  //   return { value: action.val, isValid: action.val.includes('@') };
  // }
  // if (action.type === 'INPUT_BLUR') {
  //   return { value: state.value, isValid: state.value.includes('@') };
  // }
  // return { value: '', isValid: false };
};
const passwordReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
      return { value: action.val, isValid: action.val.trim().length > 6 };
    case 'INPUT_BLUR':
      return { value: state.value, isValid: state.value.trim().length > 6 };
    default:
      throw new Error();
  }
};

const Login = props => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    let identifier = setTimeout(() => {
      // console.log('useeffect');
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);
    return () => {
      // console.log('cleanup');
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const ctx = useContext(AuthContext);

  const emailChangeHandler = event => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value });

    // setFormIsValid(passwordState.isValid && event.target.value.includes('@'));
  };

  const passwordChangeHandler = event => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });

    // setFormIsValid(event.target.value.trim().length > 6 && emailState.isValid);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' });
  };
  const emailRef = useRef();
  const passwordRef = useRef();

  const submitHandler = event => {
    event.preventDefault();
    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value);
    } else if (!emailState.isValid) {
      emailRef.current.activate();
    } else {
      passwordRef.current.activate();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          isValid={emailState.isValid}
          type="email"
          id="email"
          label="Email"
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}></Input>
        <Input
          ref={passwordRef}
          isValid={passwordState.isValid}
          type="password"
          id="password"
          label="Password"
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}></Input>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
