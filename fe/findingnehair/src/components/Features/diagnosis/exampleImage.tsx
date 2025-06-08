
interface exampleImageProps {
    imgUrl: string;
    description: string;
    }

const exampleImage = ({imgUrl, description} : exampleImageProps ) => {

    return(
        <div className="flex flex-col items-center justify-center">
            <img src={imgUrl} alt="example" className="shadow-md w-80 h-35 mt-3 mb-3"/>
            <p className="text-center text-sm text-gray-600">{description}</p>
        </div>
    )
}


export default exampleImage;