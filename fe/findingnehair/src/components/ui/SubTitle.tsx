import React from "react";

interface SubTitleProps {
    text: string;
    }


const SubTitle: React.FC<SubTitleProps> = ({text}) => {
    return <h2 className="text-center text-2xl text-gray-400">{text}</h2>
}

export default SubTitle