import { FC } from "react";
import { VerificationStatus } from "../../types/types";

interface IStatusProps {
  status: VerificationStatus;
}
export const Status: FC<IStatusProps> = ({ status }) => {
  const map = {
    [VerificationStatus.PENDING]: {
      className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
      icon: <i className="fa-regular fa-clock text-[10px]"></i>,
      text: "Pending",
    },
    [VerificationStatus.SUCCESS]: {
      className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
      icon: <i className="fa-regular fa-check-circle text-[10px]"></i>,
      text: "Verified",
    },
    [VerificationStatus.FAILED]: {
      className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
      icon: <i className="fa-regular fa-times-circle text-[10px]"></i>,
      text: "Failed",
    },
    [VerificationStatus.BLOCKED]: {
      className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
      icon: <i className="fa-regular fa-exclamation-circle text-[10px]"></i>,
      text: "Blocked",
    },
  };
  return (
    <span className={map[status].className}>
      {map[status].icon}
      {map[status].text}
    </span>
  );
};
