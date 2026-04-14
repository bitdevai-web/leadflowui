import { IEMailHistory } from "../../types/types";
import Markdown from "react-markdown";
import { Modal } from "../ui/modal";

export interface IEmailBodyProps {
  isOpen: boolean;
  onClose: () => void;
  email: IEMailHistory | null;
}

export default function Body({ isOpen, onClose, email }: IEmailBodyProps) {
  return (
    <Modal
      className="max-w-[780px] p-6 overflow-hidden max-h-[calc(100vh-100px)]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <h4 className="text-lg font-semibold">Email</h4>
      <p className="text-sm text-gray-600">Personalized Email for your lead</p>
      <div className="my-6 text-sm [&_li]:list-disc [&_li]:ml-4 [&_li]:text-gray-600 [&_li]:text-sm [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:text-gray-600 [&_ul]:text-sm">
        <Markdown children={email?.body} />
        <p>{email?.sender?.ending},</p>
        <p className="font-semibold">{email?.sender?.name}</p>
        <p className="font-semibold">{email?.sender?.designation}</p>
      </div>
    </Modal>
  );
}
