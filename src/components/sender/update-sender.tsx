import { Controller, useForm } from "react-hook-form";
import { ISenderSchema, senderSchema } from "../../schema/sender.schema";

import Button from "../ui/button/Button";
import ErrorMessage from "../form/form-elements/ErrorMessage";
import { ISender } from "../../types/types";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import { queryClient } from "../../main";
import toast from "react-hot-toast";
import { updateSender } from "../../service/sender.service";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

export interface IUpdateSenderProps {
  isOpen: boolean;
  onClose: () => void;
  sender: ISender | null;
}

export default function UpdateSender({
  isOpen,
  onClose,
  sender,
}: IUpdateSenderProps) {
  const { control, handleSubmit, reset } = useForm<ISenderSchema>({
    resolver: zodResolver(senderSchema),
    defaultValues: {
      name: "",
      ending: "",
      designation: "",
      email: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (body: ISenderSchema) => updateSender(sender!.id, body),
    mutationKey: ["update-sender"],
    onSuccess() {
      toast.success("Sender Updated!");
      queryClient.refetchQueries({
        queryKey: ["senders"],
      });
      reset();
      onClose();
    },
  });

  useEffect(() => {
    if (sender) {
      reset({
        ...sender,
      });
    }
  }, [sender]);

  return (
    <Modal className="max-w-[480px] p-6" isOpen={isOpen} onClose={onClose}>
      <h4 className="text-lg font-semibold">Update Sender</h4>
      <p className="text-sm text-gray-600">
        Update the sender details by filling out the form below. All fields are
        required.
      </p>

      <form className="mt-5" onSubmit={handleSubmit((data) => mutate(data))}>
        <Controller
          control={control}
          name="ending"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Ending <small className="text-sm text-red-500">*</small>
              </Label>
              <Input className="w-full" placeholder="Best Regards" {...field} />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />

        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Name <small className="text-sm text-red-500">*</small>
              </Label>
              <Input className="w-full" placeholder="John Doe" {...field} />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Email <small className="text-sm text-red-500">*</small>
              </Label>
              <Input
                className="w-full"
                placeholder="john.doe@example.com"
                {...field}
              />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="designation"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Designation <small className="text-sm text-red-500">*</small>
              </Label>
              <Input
                className="w-full"
                placeholder="Vice President"
                {...field}
              />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />

        <Button className="mt-2" isLoading={isPending} type="submit">
          Save
        </Button>
      </form>
    </Modal>
  );
}
