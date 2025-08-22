import React, { useState } from 'react'
import { FaToggleOn } from 'react-icons/fa6'
const FAQ = () => {
  const Questions = [
  "What is Memory Box?",
  "How does Memory Box work?",
  "Is Memory Box helpful?",
  "Can I track my patient's progress?",
  "Can I download my patient's report?",
  "Is my data safe and secure?",
  "Can I use Memory Box on mobile devices?",
  "Do I need an internet connection to use Memory Box?",
  "Can multiple doctors or caregivers access the same patient’s Memory Box?",
  "Is there a limit to the number of patients I can add?",
  "Can patients or families access their own reports?",
  "Does Memory Box support multimedia files like images, audio, or video?",
  "How often is the data updated?",
  "Can I share progress reports with other professionals?",
  "Is there customer support if I face issues?"
];

const Answers = [
  "Memory Box is a digital tool designed to store, organize, and track important patient information in one place.",
  "Memory Box works by letting you record and save patient progress, activities, and milestones, which can be reviewed anytime.",
  "Yes, it helps doctors, caregivers, and families monitor progress and create a structured record for better care.",
  "Yes, you can easily track patient progress through charts, notes, and history logs inside Memory Box.",
  "Yes, you can generate and download patient reports in a structured format for offline use.",
  "Yes, all data is encrypted and securely stored to protect patient confidentiality.",
  "Yes, Memory Box is fully accessible on mobile, tablet, and desktop devices.",
  "Yes, an internet connection is required to sync and access the latest patient data.",
  "Yes, multiple authorized users (like doctors or caregivers) can access and update the same patient’s Memory Box.",
  "No, you can add unlimited patients and track each of them individually.",
  "Yes, with proper permissions, patients and families can access their own progress and reports.",
  "Yes, Memory Box allows uploading images, voice notes, and videos to enrich patient records.",
  "Data is updated in real-time whenever changes are saved.",
  "Yes, you can securely share reports and progress summaries with other professionals.",
  "Yes, customer support is available through chat, email, and phone for any technical or usage issues."
];

    const [openIndex,setOpenIndex]=useState(null);
    const toggleAnswer=(index)=>{
        setOpenIndex(openIndex===index?null:index);
    };
  return (
    <>
      <div className="flex flex-col items-center w-full p-4 overflow-hidden">
        <span className='text-primary sm:text-xl md:text-4xl lg:text-4xl  font-bold mb-20'>Frequently Asked Questions?</span>
        <div className="w-full max-w-2xl space-y-4">
            {Questions.map((ques,index)=>{return(
                <div key={index} className="bg-white p-3 rounded-xl shadow-md">
                <div className="flex justify-between items-center cursor-pointer" onClick={
                    ()=>toggleAnswer(index)}>
                        <p className="font-semibold">{ques}</p>
                        <FaToggleOn className={`text-2xl transition-transform duration-300
                        ${openIndex===index?"rotate-180 text-green-500":"text-gray-500"}`}>    
                        </FaToggleOn>
                    </div>
                    {openIndex===index &&(
                        <p className="mt-2 text-gray-500">{Answers[index]}</p>
                    )}   
                </div>
            );
        })}
        </div>
      </div>
    </>
  );
};

export default FAQ