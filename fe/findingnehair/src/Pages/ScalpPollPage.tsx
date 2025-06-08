import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import CommonButton from '../components/ui/CommonButton';
import useUserStore from '../store/userStore';
import Header from '../components/Common/Header';
import { postPoll } from '../api/pollapi'; // 실제 API 함수 경로
import { mapGenderToInt, mapAgeGroupToInt, mapShampooFrequencyToInt, mapTreatmentFrequencyToInt } from '../components/Features/recommend/pollMapping'; // 매핑 함수 경로
import { useNavigate } from 'react-router-dom';
// --- 설문 항목 옵션 (4회 이상/년 추가됨) ---
const GENDERS = ['남성', '여성'] as const;
const AGE_GROUPS = ['선택', '10대', '20대', '30대', '40대', '50대', '60대 이상'];
const SHAMPOO_FREQUENCIES = ['선택', '1일 1회', '1일 2회', '3일에 1회', '1주일에 2회', '1주일에 1회'];
const PERM_FREQUENCIES = ['선택', '하지 않음', '1회/년', '2회/년', '3회/년', '4회 이상/년']; // 업데이트됨
const DYEING_FREQUENCIES = ['선택', '하지 않음', '1회/년', '2회/년', '3회/년', '4회 이상/년']; // 업데이트됨
type Gender = typeof GENDERS[number];

// --- 타입 정의 ---
interface PollFormData {
  gender: Gender | '';
  ageGroup: string;
  shampooFrequency: string;
  permFrequency: string;
  dyeingFrequency: string;
}

// API로 전송될 데이터 타입 정의 (숫자형)
interface PollApiPayload {
    gender: number;
    ageGroup: number;
    shampooUsageFrequency: number;
    permFrequency: number;
    hairDyeFrequency: number;
}

// --- 애니메이션 설정 (동일) ---
const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }),
};



// --- 컴포넌트 ---
const ScalpPollPage = () => {
  const userNickname = useUserStore((state) => state.myProfile?.userNickname) ?? "사용자";
  const navigate = useNavigate()

  // --- 상태 및 핸들러 ---
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PollFormData>({
    gender: '',
    ageGroup: AGE_GROUPS[0],
    shampooFrequency: SHAMPOO_FREQUENCIES[0],
    permFrequency: PERM_FREQUENCIES[0],
    dyeingFrequency: DYEING_FREQUENCIES[0],
  });
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenderSelect = (selectedGender: Gender) => {
    setFormData(prev => ({ ...prev, gender: selectedGender }));
    setDirection(1);
    setCurrentStep(2);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
        gender: '',
        ageGroup: AGE_GROUPS[0],
        shampooFrequency: SHAMPOO_FREQUENCIES[0],
        permFrequency: PERM_FREQUENCIES[0],
        dyeingFrequency: DYEING_FREQUENCIES[0]
    });
    setDirection(-1);
    setCurrentStep(1);
  };

  // --- 데이터 제출 핸들러 (매핑 로직 포함) ---
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // 1. 매핑 함수를 사용하여 formData(문자열)를 mappedData(숫자)로 변환
    const mappedData = {
      gender: mapGenderToInt(formData.gender),
      ageGroup: mapAgeGroupToInt(formData.ageGroup),
      shampooUsageFrequency: mapShampooFrequencyToInt(formData.shampooFrequency), // API 필드명 주의
      permFrequency: mapTreatmentFrequencyToInt(formData.permFrequency),
      hairDyeFrequency: mapTreatmentFrequencyToInt(formData.dyeingFrequency),
    };

    // 2. 기본적인 유효성 검사 ('선택' 항목이 있는지 확인)
    if (Object.values(mappedData).some(value => value === null)) {
      console.error("유효하지 않은 선택값이 있습니다:", formData);
      Swal.fire({
        title: "선택하지 않은 항목이 있습니다다!",
        text: "모든 항목을 올바르게 선택해주세요.",
        icon: "warning",
        confirmButtonColor: "#5CC6B8",
        confirmButtonText: "확인",
        width: "450px",
        background: "#f8f9fa",
        customClass: {
          icon: "custom-icon",
          title: "custom-title",
        }
      })
      setIsSubmitting(false);
      // 필요시 setCurrentStep(2); setDirection(-1); 등으로 이전 단계로 이동
      return;
    }

    console.log("Original FormData (사용자 선택값):", formData);
    console.log("Mapped Data to be Sent (API 전송값):", mappedData); // 변환된 데이터 확인

    try {
        // 3. 변환된 mappedData를 API로 전송 (postPoll 함수 호출)
        // postPoll 함수가 PollApiPayload 타입을 인자로 받는다고 가정
        await postPoll(mappedData as PollApiPayload);
        Swal.fire({
          icon: "success",
          title: "제출 완료",
          text: "설문조사가 성공적으로 제출되었습니다.",
          confirmButtonColor: "#5CC6B8",
          confirmButtonText: "확인",
          width: "450px",
          background: "#f8f9fa",
          customClass: {
            // icon: "custom-icon",
            title: "custom-title",
          }
      });
        handleCancel(); // 성공 시 폼 초기화 및 첫 단계로 이동
        navigate('/');
    } catch (error) {
        console.error("설문조사 제출 오류:", error);
        Swal.fire({
          title: '제출 실패',
          text: '설문조사 제출 중 오류가 발생했습니다.',
          icon: 'error',
          confirmButtonColor: "#5CC6B8",
          confirmButtonText: "확인",
          width: "450px",
          background: "#f8f9fa",
          customClass: {
          title: "custom-title",
          }
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- 스텝 완료 체크 로직 (이전/다음 버튼 활성화 등에 사용될 수 있음) ---
   const isStep2Complete = useMemo(() => (
       formData.gender !== '' && // 성별 선택 확인 추가
       formData.ageGroup !== AGE_GROUPS[0] &&
       formData.shampooFrequency !== SHAMPOO_FREQUENCIES[0] &&
       formData.permFrequency !== PERM_FREQUENCIES[0] &&
       formData.dyeingFrequency !== DYEING_FREQUENCIES[0]
   ), [formData]);

   // --- 자동 단계 이동 로직 (사용자 경험에 따라 조절) ---
   // 예: 2단계 모든 항목 선택 시 자동으로 3단계로 이동 (선택 사항)
//    useEffect(() => {
//      if (currentStep === 2 && isStep2Complete) {
//        setDirection(1);
//        setCurrentStep(3);
//      }
//    }, [currentStep, isStep2Complete]);


  // --- Select UI 렌더링 함수 ---
   const renderSelect = (name: keyof Omit<PollFormData, 'gender'>, label: string, options: readonly string[]) => (
     <div className="w-full mb-4">
       <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
         {label}
       </label>
       <select
         id={name}
         name={name}
         value={formData[name]}
         onChange={handleSelectChange}
         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#5CC6B8] focus:border-[#5CC6B8]"
         disabled={isSubmitting}
       >
         {options.map(option => (
           <option key={option} value={option} disabled={option === '선택'}>
             {option}
           </option>
         ))}
       </select>
     </div>
   );

  // --- 메인 렌더링 ---
  return (
    <div className="flex flex-col w-full max-w-md min-h-screen mx-auto bg-[#F2F6F5] p-4 rounded-t-3xl">
      <Header menu="추천정보 수집" />
      <h1 className="text-lg font-semibold mt-10 text-center text-gray-700">
        정확한 추천을 위해 <span className="text-[#5CC6B8]">{userNickname}</span>님의<br /> 정보를 조금 더 알려주세요.
      </h1>

      <div className="relative overflow-hidden flex-grow h-96 md:h-[30rem]"> {/* 높이 조절 */}
        <AnimatePresence initial={false} custom={direction}>
          {/* --- 1단계: 성별 선택 --- */}
          {currentStep === 1 && (
            <motion.div key={1} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="absolute w-full h-full flex flex-col items-center justify-center">
              <h2 className="text-xl font-medium mb-8">성별을 선택해주세요.</h2>
              <div className="flex space-x-4">
                {GENDERS.map(gender => (
                  <div
                    key={gender}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleGenderSelect(gender)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenderSelect(gender)}
                    className={`cursor-pointer px-12 py-10 rounded-lg shadow-md transition-all font-bold ${
                      formData.gender === gender
                        ? 'bg-[#5CC6B8] text-white ring-2 ring-offset-1 ring-[#5CC6B8]'
                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-lg'
                    }`}
                  >
                    {gender}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- 2단계: 나머지 항목 선택 --- */}
          {currentStep === 2 && (
            <motion.div key={2} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="absolute w-full h-full px-4 pt-8">
                <button
                    onClick={() => { setDirection(-1); setCurrentStep(1); }}
                    className="text-sm text-[#5CC6B8] hover:text-[#4aa095] mb-4"
                >
                    &larr; 성별 다시 선택
                </button>
              <div className="space-y-4">
                 {renderSelect('ageGroup', '연령대', AGE_GROUPS)}
                 {renderSelect('shampooFrequency', '샴푸 사용 빈도', SHAMPOO_FREQUENCIES)}
                 {renderSelect('permFrequency', '펌 주기', PERM_FREQUENCIES)}
                 {renderSelect('dyeingFrequency', '염색 주기', DYEING_FREQUENCIES)}
              </div>
               {/* 모든 항목 선택 시 다음 버튼 표시 */}
               {isStep2Complete && (
                 <div className="mt-6 text-center">
                     <CommonButton
                        onClick={() => { setDirection(1); setCurrentStep(3); }}
                        bgColor='main'
                        text='다음 (확인하기)'
                     />
                 </div>
               )}
            </motion.div>
          )}

          {/* --- 3단계: 확인 및 제출 --- */}
          {currentStep === 3 && (
            <motion.div key={3} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="absolute w-full h-full flex flex-col p-4">
              <h2 className="text-xl font-medium mb-4 text-center">선택하신 정보</h2>
              {/* 변환된 점수도 함께 표시 */}
              <div className="bg-white p-6 rounded-lg shadow mb-6 space-y-3 flex-grow overflow-y-auto flex flex-col justify-center items-start text-left w-full">
                <p><strong>성별:</strong> {formData.gender} (값: {mapGenderToInt(formData.gender)})</p>
                <p><strong>연령대:</strong> {formData.ageGroup} (값: {mapAgeGroupToInt(formData.ageGroup)})</p>
                <p><strong>샴푸 빈도:</strong> {formData.shampooFrequency} (점수: {mapShampooFrequencyToInt(formData.shampooFrequency)})</p>
                <p><strong>펌 주기:</strong> {formData.permFrequency} (점수: {mapTreatmentFrequencyToInt(formData.permFrequency)})</p>
                <p><strong>염색 주기:</strong> {formData.dyeingFrequency} (점수: {mapTreatmentFrequencyToInt(formData.dyeingFrequency)})</p>
              </div>
              <div className="flex space-x-2 mt-auto">
                <CommonButton
                    onClick={() => { setDirection(-1); setCurrentStep(2); }} // 2단계로 돌아가기
                    bgColor='sub'
                    text='이전'
                 />
                 <CommonButton
                    onClick={handleSubmit} // 수정된 handleSubmit 호출
                    bgColor='main'
                    text={isSubmitting ? '전송 중...' : '제출하기'}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScalpPollPage;