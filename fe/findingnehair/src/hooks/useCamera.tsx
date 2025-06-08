import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';


const useCamera = () => {
    const cameraRef = useRef<Webcam>(null);
    const [image, setImage] = useState<string | null>(null);

    const capture = useCallback(() => {
        if (cameraRef.current) {
            const imageSrc = cameraRef.current.getScreenshot();
            setImage(imageSrc);
        }
    },[cameraRef]);

    return(
        {
            capture,
            image,
            setImage,
            cameraRef,
        }
    )
}

export default useCamera;