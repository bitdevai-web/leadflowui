import { FC, ReactNode } from "react";

interface IStatusProps {
  status: boolean;
}
export const EmailGenerated: FC<IStatusProps> = ({ status }) => {
  const map: Record<
    `${boolean}`,
    { className: string; icon: ReactNode; text: string }
  > = {
    true: {
      className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
      icon: <i className="fa-regular fa-check-circle text-[10px]"></i>,
      text: "Generated",
    },
    false: {
      className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
      icon: <i className="fa-regular fa-minus-circle text-[10px]"></i>,
      text: "Not Yet",
    },
  };
  return (
    <span className={map[`${status}`].className}>
      {map[`${status}`].icon}
      {map[`${status}`].text}
    </span>
  );
};
