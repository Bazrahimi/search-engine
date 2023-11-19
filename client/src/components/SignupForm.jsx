import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { CREATE_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';

const SignupForm = () => {


  // State to store user form data
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });

    // Initialize the useMutation hook with the CREATE_USER mutation
    const [signUpAccount, { error }] = useMutation(CREATE_USER);
  
  
  // State to control the visibility of the alert message
  const [showAlert, setShowAlert] = useState(false);

  // Handler for changes in form inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update the userFormData state with new input values
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    // Check if form is valid according to HTML5 validation
    const form = event.currentTarget;
    console.log('Form submitted', userFormData); // Debug log
  
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      console.log('Form is invalid!'); // Debug log
      return; // Make sure to return if the form is not valid
    }
  
    try {
      // Execute the createUser mutation with variables from the form data
      const { data } = await signUpAccount({
        variables: { ...userFormData },
    
      });


        if (data.createUser.token) {
          Auth.login(data.createUser.token); // Automatically log the user in after signup
        } else {
          // Handle the case where signup didn't return a token
          console.error('Signup successful but no token received.');
          setShowAlert(true);
        }



      setUserFormData({
        username: '',
        email: '',
        password: '',
      });
    } catch (e) {
      // Log the error and show the alert message
      console.error('Mutation error', e); // Debug log
      setShowAlert(true);
    }
  };

  return (
    <>
      <Form  onSubmit={handleFormSubmit}>
        {/* Alert for displaying errors like network issues or failed submissions */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert || Boolean(error)} variant='danger'>
          {error ? error.message : "Something went wrong with your signup!"}
        </Alert>

        {/* Form Group for username */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          {/* Feedback shown when form validation fails */}
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Form Group for email */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          {/* Feedback shown when form validation fails */}
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Form Group for password */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          {/* Feedback shown when form validation fails */}
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Submit button, disabled if any of the form fields are empty */}
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
