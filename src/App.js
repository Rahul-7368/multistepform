import React, { useState, useEffect } from 'react';

function MultiStepForm() {
  const[step, setStep] = useState(1);
  const[isSubmitted, setIsSubmitted] = useState(false);
  const[formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: ''

  });
  const[errors, setErrors] = useState({});

  useEffect(() => {
    try{
      const savedData = localStorage.getItem('formData');
    if(savedData){
      setFormData(JSON.parse(savedData));
    }
    }catch(error){
      console.error('Error loading data from local storage:',error)
    }
  }, []);

  useEffect(() => {
    try{
    localStorage.setItem('formData', JSON.stringify(formData));
    }catch(error){
       console.error('Error saving data to localStorage:', error);
    }
  }, [formData]);

  useEffect(() => {
    setErrors({});
  }, [step]);

  const validateField = (name, value) => {
    switch(name) {
      case 'email':
        return value.includes('@') && value.includes('.') ? '' : 'Invalid email format';
        case 'phone':
          return value.length===10 && !isNaN(value) ? '' : 'Phone number should be 10 digits';
          case 'zip':
            return value.length===6 && !isNaN(value) ? '' : 'ZIP Code should be 6 digits';
            default:
              return value.trim() === '' ? 'This field is required' : '';
    }
  };

  const handleChange = (e) => {
    const{ name, value} = e.target;
    setFormData({ ...formData, [name]: value});
    setErrors({...errors, [name]: validateField(name,value)});
  };

  const nextStep = () => {
    if(isStepValid()){
    setStep((prevStep)=>prevStep + 1);

    }
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  }

  const handleSubmit = (e)=> {
    e.preventDefault();
    if(isStepValid()){
      console.log('Form Data Submitted:', formData);
      setIsSubmitted(true);
      alert('Form Submitted Successfully!')
      localStorage.removeItem('formData');
    }

  };

  const isStepValid = () => {
    const stepErrors={};
    let valid=true;

    const fieldsToValidate = step === 1
        ?['name', 'email', 'phone']
        : step === 2
        ?['address1', 'city', 'state', 'zip']
        : [];

        fieldsToValidate.forEach((field) => {
          const error = validateField(field, formData[field]);
          if(error){
            stepErrors[field] = error;
            valid=false;
          }
        });

        setErrors(stepErrors);
        return valid;
  }

  return (
    <div className="container form-container">
      <h2>Multi-step Form</h2>
      {/* <div className="form-container"></div> */}

      {isSubmitted ? (
        <div>
          <h3>Thank you!</h3>
          <p>Your form has been successfully submitted.</p>
        </div>
      ) : (
      <form onSubmit={handleSubmit}>
        <div className="tab-navigation">
          <button type="button" onClick={() => setStep(1)} disabled={step===1}>Step1</button>
          <button type="button" onClick={() => setStep(2)} disabled={step===2}>Step2</button>
          <button type="button" onClick={() => setStep(3)} disabled={step===3}>Step3</button>

        </div>
        {step===1 && (
          <div>
            <h3>Step 1: Personal Information</h3>
            <label>
              Name:
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={errors.name ? 'error' : ''} required />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </label>
            <br/>
            <label>
              Email:
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} required />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </label>
            <br/>
            <label>
              Phone:
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? 'error' : ''} required />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </label>
            <br/>
            <button type="button" onClick={nextStep}>Next</button>
          </div>
        )}
        {step===2 && (
          <div>
            <h3>Step 2: Address Information</h3>
            <label>
              Address Line 1:
              <input type="text" name="address1" value={formData.address1} onChange={handleChange} className={errors.address1 ? 'error' : ''} required />
              {errors.address1 && <p className="error-message">{errors.address1}</p>}
            </label>
            <br/>
            <label>
              Address Line 2:
              <input type="text" name="address2" value={formData.address2} onChange={handleChange} required />
            </label>
            <br/>
            <label>
              City:
              <input type="text" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'error' : ''} required />
              {errors.city && <p className="error-message">{errors.city}</p>}
            </label>
            <br/>
            <label>
              State:
              <input type="text" name="state" value={formData.state} onChange={handleChange} className={errors.state ? 'error' : ''} required />
              {errors.state && <p className="error-message">{errors.state}</p>}
            </label>
            <br/>
            <label>
              ZIP Code:
              <input type="text" name="zip" value={formData.zip} onChange={handleChange} className={errors.zip ? 'error' : ''} required />
              {errors.zip && <p className="error-message">{errors.zip}</p>}
            </label>
            <br/>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="button" onClick={nextStep}>Next</button>
          </div>
        )}
        {step===3 && (
          <div>
            <h3>Step3: Confirmation</h3>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Address Line 1:</strong> {formData.address1}</p>
            <p><strong>Address Line 2:</strong> {formData.address2}</p>
            <p><strong>City:</strong> {formData.city}</p>
            <p><strong>State:</strong> {formData.state}</p>
            <p><strong>ZIP Code:</strong> {formData.zip}</p>
            {/* {!isSubmitted && (
                <button type="button" onClick={prevStep}>Previous</button>
              )} */}

            <button type="button" onClick={prevStep}>Previous</button>
            <button type="submit">Submit</button>

          </div>
        )}
      </form>
      )}
    </div>
  );
  
  

}

export default MultiStepForm;



