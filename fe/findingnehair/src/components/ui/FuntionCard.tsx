import React, { ReactNode } from 'react';

interface FunctionCardProps {
  icon: ReactNode;
  title: string;
  onClick: () => void;
}

const FuntionCard: React.FC<FunctionCardProps> = ({ icon, title, onClick,  }) => {
  return (
    <div
      className="w-4/5 max-w-xl p-14 bg-white rounded-xs shadow-md cursor-pointer hover:shadow-lg flex items-center mx-auto"
      onClick={onClick}
    >
      <div className="mr-4">
        <span className="text-4xl">{icon}</span> 
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-0.5">{title}</h2>
        {/* <h2 className="text-left text-base font-semibold whitespace-pre-line">{title}</h2> */}
      </div>
    </div>
  );
};

export default FuntionCard;
