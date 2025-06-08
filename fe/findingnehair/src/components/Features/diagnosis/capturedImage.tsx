interface CapturedImageProps {
    imgUrl: string | undefined; // imgUrl prop 타입 정의
    }

const CapturedImage = ({imgUrl} : CapturedImageProps ) => {

    return(
        <img src={imgUrl} alt="captured" className="w-4/5 mx-auto max-h-60 object-contain mb-3"/>
    )
}

export default CapturedImage;
