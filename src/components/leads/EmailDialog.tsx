import { Controller, useForm } from "react-hook-form";
import { IEmail, IEmailSchedule } from "../../types/types";
import {
  getEmailStatus,
  scheduleEmail,
  updateEmail,
} from "../../service/lead.service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import Button from "../ui/button/Button";
import ErrorMessage from "../form/form-elements/ErrorMessage";
import Input from "../form/input/InputField";
import Markdown from "../form/input/Markdown";
import { Modal } from "../ui/modal";
import Select from "../form/Select";
import clsx from "clsx";
import { emailScheduleSchema } from "../../schema/lead.schema";
import { getSenders } from "../../service/sender.service";
import { queryClient } from "../../main";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";

export interface IEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  emails?: IEmail[];
}

export default function EmailDialog({
  isOpen,
  onClose,
  emails,
}: IEmailDialogProps) {
  const tabMap: Record<number, string> = {
    0: "First",
    1: "Second",
    2: "Third",
  };
  const [tab, setTab] = useState(0);
  const form = useForm<IEmailSchedule>({
    defaultValues: {
      lead_id: "",
      sender_id: "" as unknown as number,
      subject: "",
      body: "",
      scheduled_time_min: "00:00",
      scheduled_time_max: "23:59",
      current_index: 0,
    },
    resolver: zodResolver(emailScheduleSchema),
  });
  const { data: senders } = useQuery({
    queryKey: ["senders"],
    queryFn: () => getSenders({ per_page: 100, page: 1 }),
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["schedule-email"],
    mutationFn: scheduleEmail,
    onSuccess() {
      toast.success("Email Scheduled!");
      refetch();
      queryClient.refetchQueries({ queryKey: ["leads"] });
      onClose();
    },
    onError(er) {
      toast.error(er.message);
    },
  });

  const { mutate: sentMutation, isPending: isPendingSent } = useMutation({
    mutationKey: ["schedule-email"],
    mutationFn: scheduleEmail,
    onSuccess() {
      toast.success("Email Sent!");
      refetch();
      queryClient.refetchQueries({ queryKey: ["leads"] });
      onClose();
    },
    onError(er) {
      toast.error(er.message);
    },
  });

  const email = emails?.[tab];
  const body = email?.body;
  const subject = email?.subject;
  const lead_id = email?.lead_id;

  const { data: emailStatus, refetch } = useQuery({
    queryKey: ["email-status", lead_id],
    queryFn: () => getEmailStatus(lead_id!),
    enabled: !!lead_id,
  });

  const { mutate: updateEmailMutation, isPending: isUpdateEmailPending } =
    useMutation({
      mutationKey: ["update-email"],
      mutationFn: (data: { subject: string; body: string }) =>
        updateEmail(email?.id!, data),
      onSuccess() {
        toast.success("Email Updated!");
        queryClient.invalidateQueries({
          queryKey: ["email", lead_id],
        });
      },
      onError(er) {
        toast.error(er.message);
      },
    });

  useEffect(() => {
    if (lead_id) {
      form.setValue("lead_id", email.lead_id);
      form.setValue("current_index", tab);
      form.setValue("subject", subject ?? "");
      form.setValue("body", body ?? "");
    }
  }, [lead_id, tab]);

  useEffect(() => {
    setTab(0);
  }, [lead_id]);

  const handleSend = () => {
    const fields = ["body", "subject", "sender_id"] as const;
    form.trigger(fields);

    if (
      !Object.keys(form.formState.errors).some((key) =>
        fields.includes(key as (typeof fields)[number])
      )
    ) {
      const values = form.getValues();
      sentMutation([
        { ...values, scheduled_time_max: "23:59", scheduled_time_min: "00:00" },
      ]);
    }
  };

  const isButtonDisable = useCallback<(index: number) => [boolean, string]>(
    (index) => {
      const status = emailStatus?.data.find(
        (item) => item.current_index == index
      );

      if (!status) return [false, "Schedule Email"];

      return [true, "Email is Sent/Scheduled"];
    },
    [emailStatus]
  );

  const buttonDisable = isButtonDisable(tab);

  const options = useMemo(() => {
    return senders?.data.map((sender) => ({
      label: sender.name,
      value: String(sender.id),
    }));
  }, [senders]);

  return (
    <Modal
      className="max-w-[780px] p-6 overflow-hidden max-h-[calc(100vh-100px)]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <h4 className="text-lg font-semibold">Emails</h4>
      <p className="text-sm text-gray-600">Personalized for your leads</p>
      <div>
        <div className="mt-5">
          {!emails ? (
            <p className="text-sm text-gray-500">No emails found</p>
          ) : (
            <div className="size-full">
              <div className="w-full flex flex-row items-center justify-between gap-2">
                {emails?.map((email, index) => (
                  <div
                    key={email.id}
                    className={clsx(
                      "text-sm px-4 py-2 w-full text-center rounded-md cursor-pointer",
                      tab === index ? "bg-gray-200" : "bg-white"
                    )}
                    onClick={() => setTab(index)}
                  >
                    {tabMap[index]}{" "}
                    <span className="text-sm">
                      {isButtonDisable(index)[0] ? (
                        <span>({isButtonDisable(index)[1]})</span>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <form
                className={clsx(
                  "w-full flex flex-col items-center py-4 gap-3 max-h-[70vh] overflow-y-auto",
                  buttonDisable[0] && "opacity-70 pointer-events-none"
                )}
                onSubmit={form.handleSubmit((data) => mutate([data]))}
              >
                <Controller
                  control={form.control}
                  name="subject"
                  render={({ field, fieldState }) => (
                    <div className="w-full">
                      <Input placeholder="Subject" {...field} />
                      <ErrorMessage fieldState={fieldState} />
                    </div>
                  )}
                />
                <Controller
                  control={form.control}
                  name="body"
                  render={({ field, fieldState }) => (
                    <div className="w-full">
                      <Markdown {...field} />
                      <ErrorMessage fieldState={fieldState} />
                    </div>
                  )}
                />
                <Controller
                  control={form.control}
                  name="sender_id"
                  render={({ field, fieldState }) => (
                    <div className="w-full">
                      <Select
                        className="w-full"
                        options={options ?? []}
                        placeholder="Select Sender"
                        {...field}
                      />
                      <ErrorMessage fieldState={fieldState} />
                    </div>
                  )}
                />
                <Controller
                  control={form.control}
                  name="scheduled_time_min"
                  render={({ field, fieldState }) => (
                    <div className="w-full">
                      <Input
                        type="time"
                        {...field}
                        onFocus={(e) => e.target.showPicker()}
                      />
                      <ErrorMessage fieldState={fieldState} />
                    </div>
                  )}
                />
                <Controller
                  control={form.control}
                  name="scheduled_time_max"
                  render={({ field, fieldState }) => (
                    <div className="w-full">
                      <Input
                        type="time"
                        {...field}
                        onFocus={(e) => e.target.showPicker()}
                      />

                      <ErrorMessage fieldState={fieldState} />
                    </div>
                  )}
                />
                <Button
                  variant="outline"
                  isLoading={isUpdateEmailPending}
                  className="w-full"
                  type="button"
                  onClick={() => updateEmailMutation(form.getValues())}
                >
                  Save Email
                </Button>
                <Button isLoading={isPending} className="w-full">
                  Schedule Email
                </Button>
                <Button
                  isLoading={isPendingSent}
                  className="w-full ring-violet-500"
                  variant="outline"
                  onClick={handleSend}
                  type="button"
                >
                  Send Now
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
