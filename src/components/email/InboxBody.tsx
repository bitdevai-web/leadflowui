import { IEMailHistory } from "../../types/types";
import { Modal } from "../ui/modal";

export interface IEmailBodyProps {
  isOpen: boolean;
  onClose: () => void;
  email: IEMailHistory | null;
}

export default function InboxBody({ isOpen, onClose, email }: IEmailBodyProps) {
  return (
    <Modal
      className="max-w-[780px] p-6 overflow-hidden max-h-[calc(100vh-100px)]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <h4 className="text-lg font-semibold">Email</h4>
      <div className="my-6 max-h-[60vh] overflow-auto text-sm [&_li]:list-disc [&_li]:ml-4 [&_li]:text-gray-600 [&_li]:text-sm [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:text-gray-600 [&_ul]:text-sm">
        <div dangerouslySetInnerHTML={{ __html: email?.body ?? "" }} />
        <p>{email?.sender?.ending},</p>
      </div>
    </Modal>
  );
}
