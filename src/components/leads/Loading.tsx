import { Modal } from "../ui/modal";

export interface LoadingComponentProps {
  isOpen: boolean;
  title?: string;
  subTitle?: string;
}

export default function Loading({
  isOpen,
  title,
  subTitle,
}: LoadingComponentProps) {
  return (
    <Modal
      showCloseButton={false}
      className="max-w-[280px] p-6 overflow-hidden max-h-[calc(100vh-100px)]"
      isOpen={isOpen}
      onClose={() => {}}
    >
      <div className="flex flex-row items-center gap-3 p-3">
        <i className="fa-spinner-scale fa-light fa-spin"></i>
        <div>
          <p className="text-sm font-semibold text-neutral-800">{title}</p>
          <p className="text-xs font-semibold text-neutral-600">{subTitle}</p>
        </div>
      </div>
    </Modal>
  );
}
