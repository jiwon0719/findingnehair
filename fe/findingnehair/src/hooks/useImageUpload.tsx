// 훅이 반환할 값들의 타입을 정의할 수 있습니다 (선택 사항)
interface UseImageUploadReturn {
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<string | null>;

}

const useImageUpload = (): UseImageUploadReturn => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      // setIsLoading(true);
      // setError(null);

      const files = event.target.files;
      if (!files || files.length === 0) {
        // setIsLoading(false);
        // setError('파일이 선택되지 않았습니다.');
        console.warn("파일이 선택되지 않았습니다.");
        resolve(null); // 파일이 없으면 null 반환
        return;
      }

      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        // setIsLoading(false);
        resolve(reader.result as string); // 읽기 성공 시 Base64 문자열 반환
      };

      reader.onerror = (error) => {

        console.error('FileReader 오류:', error);
        reject(error);
      };

      // 파일을 Base64 데이터 URL로 읽기 시작
      reader.readAsDataURL(file);

      // 이벤트 핸들러 후 파일 입력 값 초기화 (동일한 파일 재선택 가능하도록)
      event.target.value = ''; 
    });
  };


  return { handleImageUpload };
};

export default useImageUpload;