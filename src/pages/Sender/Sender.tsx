import DataTable, { TableColumn } from "react-data-table-component";
import { ISender, Pagination } from "../../types/types";
import { deleteSender, getSenders } from "../../service/sender.service";
import { useMutation, useQuery } from "@tanstack/react-query";

import Button from "../../components/ui/button/Button";
import CreateSender from "../../components/sender/create-sender";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import UpdateSender from "../../components/sender/update-sender";
import { queryClient } from "../../main";
import toast from "react-hot-toast";
import { useState } from "react";
import { MOCK_SENDERS } from "../../data/mockData";

enum ModalState {
  CREATE,
  NONE,
  EDIT,
}
export default function Sender() {
  const [sender, setSender] = useState<ISender | null>(null);
  const [modalState, setModalState] = useState<ModalState>(ModalState.NONE);

  const [pagination, setPagination] = useState<Pagination>({
    per_page: 10,
    page: 1,
  });

  const { data: apiData } = useQuery({
    queryKey: ["senders", pagination.per_page, pagination.page],
    queryFn: () => getSenders(pagination),
  });
  const data = apiData ?? { data: MOCK_SENDERS, total: MOCK_SENDERS.length };

  const { mutate } = useMutation({
    mutationKey: ["delete-sender"],
    mutationFn: (id: number) => deleteSender(id),
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: ["senders"],
      });
    },
    onError(er) {
      toast.error(er.message);
    },
  });

  // Simplified column definitions by removing unnecessary type casting
  const columns: TableColumn<ISender>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Ending",
      selector: (row) => row.ending,
      sortable: true,
    },
    {
      name: "Designation",
      selector: (row) => row.designation,
      sortable: true,
    },
    {
      name: "Actions",
      width: "140px",
      selector: (row): any => (
        <div className="flex items-center gap-1.5 py-2">
          <button
            title="Edit"
            onClick={() => { setSender(row); setModalState(ModalState.EDIT); }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
          >
            <i className="fa-solid fa-pencil text-[11px]"></i> Edit
          </button>
          <button
            title="Delete"
            onClick={() => confirm("Are you sure? This action is irreversable") && mutate(row.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <i className="fa-regular fa-trash-alt text-[11px]"></i>
          </button>
        </div>
      ),
    },
  ];

  const handleClose = () => setModalState(ModalState.NONE);

  return (
    <>
      <PageMeta title="Leadflow - Email Senders" description="" />
      <PageBreadcrumb
        pageTitle="Email Senders"
        pageDetails="Manage your email senders"
        component={
          <div className="flex flex-row gap-2">
            <Button
              variant="primary"
              onClick={() => setModalState(ModalState.CREATE)}
            >
              Create Sender
            </Button>
          </div>
        }
      />

      <div className="data-table-card">
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
          dense
          customStyles={{
            rows: {
              style: {
                minHeight: '36px',
                paddingTop: '0',
                paddingBottom: '0',
              },
            },
            headCells: {
              style: {
                paddingTop: '8px',
                paddingBottom: '8px',
              },
            },
            cells: {
              style: {
                paddingTop: '8px',
                paddingBottom: '8px',
              },
            },
          }}
        />
      </div>
      <CreateSender
        onClose={handleClose}
        isOpen={modalState == ModalState.CREATE}
      />
      <UpdateSender
        onClose={handleClose}
        isOpen={modalState == ModalState.EDIT}
        sender={sender}
      />
    </>
  );
}
