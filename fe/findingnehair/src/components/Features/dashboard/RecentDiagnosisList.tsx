import RecentDiagnosisItem from "./RecentDiagnosisItem";
import { ApiDiagnosisItem } from "../../../types/DiagnosisTypes";
interface RecentDiagnosisListProps {
    diagnosis: ApiDiagnosisItem [];
}


const RecentDiagnosisList = ({diagnosis} : RecentDiagnosisListProps) => {
    return(
        <div className="flex flex-col w-full max-w-full cursor-pointer">
                <div className="w-full flex flex-col items-center justify-center gap-3" >
                    {diagnosis.map((dig, index) => (
                        <RecentDiagnosisItem key={index} diagnosis={dig} />
                    ))}
                </div>
            </div>
    );
};

export default RecentDiagnosisList;
