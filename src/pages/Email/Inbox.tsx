import { Controller, useForm } from "react-hook-form";
import DataTable, { TableColumn } from "react-data-table-component";
import { IEMailHistory, IEmailInbox, Pagination } from "../../types/types";
import {
  IEmailInboxFilter,
  emailInboxFilterSchema,
} from "../../schema/email.schema";

import Button from "../../components/ui/button/Button";
import InboxBody from "../../components/email/InboxBody";
import Input from "../../components/form/input/InputField";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getEmailInbox } from "../../service/email.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MOCK_INBOX_EMAILS } from "../../data/mockData";

enum ModalState {
  EMAIL,
  NONE,
}
export default function Inbox() {
  const [modalState, setModalState] = useState<ModalState>(ModalState.NONE);
  const [email, setEmail] = useState<IEMailHistory | null>(null);
  const { control, getValues, reset } = useForm<IEmailInboxFilter>({
    resolver: zodResolver(emailInboxFilterSchema),
    defaultValues: {
      reply_for_id: "",
      from_: "",
    },
  });
  const [pagination, setPagination] = useState<Pagination>({
    per_page: 10,
    page: 1,
  });

  const { data: apiData, refetch: refetchEmails } = useQuery({
    queryKey: ["inbox-emails", pagination.per_page, pagination.page],
    queryFn: () => getEmailInbox({ ...pagination, ...getValues() }),
    refetchOnWindowFocus: true,
  });
  const data = apiData ?? { data: MOCK_INBOX_EMAILS, total: MOCK_INBOX_EMAILS.length };

  const columns: TableColumn<IEmailInbox>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Sender Name",
      selector: (row) => row.sender?.name,
      sortable: true,
    },
    {
      name: "Sender Email",
      selector: (row) => row.sender?.email,
      sortable: true,
    },
    {
      name: "From",
      selector: (row) => row.from_,
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      sortable: true,
    },
    {
      name: "Body",
      selector: (row): any => (
        <div
          className="cursor-pointer"
          onClick={() => {
            setEmail({
              body: row.html,
              sender: null,
            } as any);
            setModalState(ModalState.EMAIL);
          }}
        >
          <span className="text-blue-500 fa-solid fa-eye"></span>
        </div>
      ),
      sortable: true,
    },

    {
      name: "Timestamp",
      selector: (row) => new Date(row.time).toLocaleString(),
      sortable: true,
    },
  ];

  const handleClose = () => setModalState(ModalState.NONE);

  return (
    <>
      <PageMeta title="Leadflow - Email Inbox" description="" />
      <PageBreadcrumb
        pageTitle="Inbox"
        pageDetails="View all the email response"
        component={<div className="flex flex-row gap-2"></div>}
      />
      <div className="mb-6">
        <form className="flex flex-row w-full gap-3">
          <Controller
            control={control}
            name="from_"
            render={({ field }) => (
              <Input placeholder="From (Search by Name or Email)" {...field} />
            )}
          />

          <Button
            type="button"
            onClick={() => refetchEmails()}
            size="sm"
            className="w-1/10"
          >
            Filter
          </Button>
          <Button
            type="button"
            onClick={() => {
              reset({});
              refetchEmails();
            }}
            size="sm"
            variant="outline"
            className="w-1/10"
          >
            Clear
          </Button>
        </form>
      </div>
      <div className="space-y-6 w-full overflow-auto">
        <DataTable
          responsive
          columns={columns}
          data={data?.data ?? []}
          pagination
          paginationServer
          paginationTotalRows={data?.total ?? 0}
          paginationPerPage={pagination.per_page}
          onChangeRowsPerPage={(per_page) =>
            setPagination({ ...pagination, per_page })
          }
          paginationRowsPerPageOptions={[25, 50, 100, 200]}
          onChangePage={(page) => setPagination({ ...pagination, page })}
        />
      </div>
      <InboxBody
        isOpen={modalState == ModalState.EMAIL}
        onClose={handleClose}
        email={email}
      />
    </>
  );
}
