import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'

import { FormField, CustomButton, Loader } from '../components'
import { money } from '../assets'
import { checkIfImage } from '../utils'

import { useFundingContext } from '../context'



const CreateCampaign = () => {
  const navigate = useNavigate();
  const { createCampaign, isTransactionPending } = useFundingContext();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    imageUrl: ''
  });

const handleFormFieldChange = (fieldName, e) => {
  setForm({ ...form, [fieldName]: e.target.value})
}

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.title || !form.description || !form.goal || !form.deadline || !form.imageUrl) {
      alert('Please fill all required fields');
      return;
    }
    
    checkIfImage(form.imageUrl, async (exists) => {

      if(exists){
        setIsLoading(true);

        try {
          const deadline = Math.floor(new Date(form.deadline).getTime() / 1000);

          const data = { 
                  ...form, 
                  goal: form.goal,
                  deadline: deadline          
          };

          const result = await createCampaign(data);

          if(!isTransactionPending) {
            console.log("Campaign created successfully", result);
            navigate('/');
          }  
        } catch (error) {
          console.log("Error creating a campaign:", error);
          if (error.message.includes("deadline")) {
            alert("The deadline must be a future date");
          } else {
            alert("Error creating the campaign. Console for more details");
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        alert("Enter a valid image URL");
        setForm(prev => ({ ...prev, imageUrl: ''}));
      }
    });
    
    
    console.log(form);
  }

  return (
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      {(isLoading || isTransactionPending) && <Loader 
                                                showMessage = {true}
                                              />}

      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h1>
      </div>

      <form onSubmit={handleSubmit} className='w-full mt-[65px] flex flex-col gap-[30px]' >
        <div className='flex flex-wrap gap-[40px]'>
          <FormField 
            labelName = "Your Name *"
            placeholder = "eg. Malului Geoffrey"
            inputType = "text"
            value = {form.name}
            handleChange = {(e) => {handleFormFieldChange('name', e)}}
          />
          
          <FormField 
            labelName = "Campaign Title *"
            placeholder = "Write a title"
            inputType = "text"
            value = {form.title}
            handleChange = {(e) => {handleFormFieldChange('title', e)}}
          />
        </div>

        <FormField 
            labelName = "Story *"
            placeholder = "Write your story"
            isTextArea
            value = {form.description}
            handleChange = {(e) => {handleFormFieldChange('description', e)}}
        />
          
        <div className='w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]'>
          <img src={money} alt="money" className='w-[40px] h-[40px] object-contain'/>
          <h4 className='font-epilogue font-bold text-[25px] text-white ml-[20px]'>
            You will get 100% of the raised amount
          </h4>
        </div>

        <div className='flex flex-wrap gap-[40px]'>
          <FormField 
              labelName = "Goal *"
              placeholder = "ETH 0.50"
              inputType = "text"
              value = {form.goal}
              handleChange = {(e) => {handleFormFieldChange('goal', e)}}
          />
            
          <FormField 
            labelName = "End Date *"
            placeholder = "End Date"
            inputType = "date"
            value = {form.deadline}
            handleChange = {(e) => {handleFormFieldChange('deadline', e)}}
          />
        </div>

        <FormField 
            labelName = "Campaign image *"
            placeholder = "Place image url of your campaign"
            inputType = "url"
            value = {form.imageUrl}
            handleChange = {(e) => {handleFormFieldChange('imageUrl', e)}}
          />

        <div className="flex justify-center items-center mt-[40px]">
            <CustomButton 
              btnType = "submit"
              title = {isTransactionPending ? "Processing..." : "Submit new Campaign"}
              styles = {`bg-[#1dc071] ${isTransactionPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
        </div>
      </form>
    </div>
  )
}

export default CreateCampaign