import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';
import { LOGIN_USER } from '../utils/mutations';
import { useMutation } from '@apollo/client';

const LoginForm = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(false);

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      if (data.login.token) {
        Auth.login(data.login.token);
      }
    } catch (e) {
      console.error('Login error:', e);
      setShowAlert(true);
    }

    setFormState({ email: '', password: '' });
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      {showAlert && (
        <Alert dismissible onClose={() => setShowAlert(false)} variant='danger'>
          {error ? error.message : 'Something went wrong with your login credentials!'}
        </Alert>
      )}
      <Form.Group className='mb-3'>
        <Form.Label htmlFor='email'>Email</Form.Label>
        <Form.Control
          type='text'
          placeholder='Your email'
          name='email'
          value={formState.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label htmlFor='password'>Password</Form.Label>
        <Form.Control
          type='password'
          placeholder='Your password'
          name='password'
          value={formState.password}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Button
        disabled={!(formState.email && formState.password)}
        type='submit'
        variant='success'>
        Submit
      </Button>
    </Form>
  );
};

export default LoginForm;
