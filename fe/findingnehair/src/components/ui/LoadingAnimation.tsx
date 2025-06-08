import {GridLoader} from 'react-spinners';

// 술사진 로딩 페이지 
import { CSSProperties } from 'react';

const override: CSSProperties = {
    display: 'block',
    margin: '0 auto',
    marginTop: '220px',
    textAlign: 'center',
    color: '#5CC6B8',
};

interface LoadingProps{
    text : string;
    loading: boolean;
}

const LoadingAnimation = ({text, loading}: LoadingProps )  =>{
    return (
        <div>
          <GridLoader
            color="#5CC6B8"
            loading={loading}
            cssOverride={override}
            size={24}
            speedMultiplier={0.8}
            margin={3}
          />
            <div style = {{
                padding:'20px',
                color:'#000000',
                fontWeight : '700',
            }}>
           <h2>{text? text : '꼼꼼하게 두피를 분석하고 있어요'}</h2>
            </div>
        </div>
    )
}

export default LoadingAnimation;
