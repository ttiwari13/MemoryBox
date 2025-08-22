import React from 'react';
import { User, HelpCircle, Pill, CheckSquare } from 'lucide-react';

const HowToUse = () => {
  const steps = [
    {
      icon: <User className="w-12 h-12 text-purple-500 mb-4 transition-transform duration-300 group-hover:scale-110" />,
      title: "Contact & Memory Recall",
      description: "See photos of loved ones and try to guess who they are.",
    },
    {
      icon: <HelpCircle className="w-12 h-12 text-yellow-500 mb-4 transition-transform duration-300 group-hover:scale-110" />,
      title: "Memory Quiz",
      description: "Engage in fun quizzes designed to exercise your memory.",
    },
    {
      icon: <Pill className="w-12 h-12 text-red-500 mb-4 transition-transform duration-300 group-hover:scale-110" />,
      title: "Track Medication",
      description: "Log your pills and get reminders for your daily medication.",
    },
    {
      icon: <CheckSquare className="w-12 h-12 text-green-500 mb-4 transition-transform duration-300 group-hover:scale-110" />,
      title: "Daily Tasks",
      description: "Keep track of activities and see what you’ve accomplished today.",
    },
  ];

  const Connector = ({ isLast }) => {
    if (isLast) return null;
    return (
      <div className="flex items-center justify-center my-4 md:my-0">
        <div className="relative bg-primary h-16 w-1 md:h-1 md:w-16">
          <div className="absolute right-1/2 bottom-0 w-3 h-3 bg-primary transform translate-x-1/2 translate-y-1/2 rotate-45 md:left-auto md:right-0 md:bottom-1/2 md:translate-x-1/2 md:translate-y-1/2"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white py-16 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-primary mb-4">How It Works</h2>
        <p className="text-lg text-secondary mb-12 max-w-2xl mx-auto">
          Our Memory Box helps Alzheimer patients in four simple steps.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center max-w-xs group">
                <div className="bg-white p-6 rounded-full shadow-lg border-2 border-gray-200 transition-colors duration-300 group-hover:bg-blue-50 group-hover:border-blue-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary mt-6 mb-2">
                  {step.title}
                </h3>
                <p className="text-secondary">
                  {step.description}
                </p>
              </div>
              <Connector isLast={index === steps.length - 1} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
