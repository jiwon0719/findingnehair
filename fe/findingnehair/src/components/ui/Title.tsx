import React from "react";

interface TitleProps {
    text: string;
}

const Title: React.FC<TitleProps> = ({text}) => {
    return <h1 className="text-left text-xl mb-3 font-bold text-[#333333]">{text}</h1>
}

export default Title;