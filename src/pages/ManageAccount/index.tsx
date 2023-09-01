import { Box, Button, Card, Container, Dialog, DialogContent, InputAdornment, Tab, Tabs, TextField } from "@mui/material";
import Page from "../../components/Page";
import useTabs from "../../hooks/useTabs";
import { useState } from "react";
import Iconify from "../../components/Iconify";
import DataTable from "../../components/table/DataTable";
import { HeadLabelCustom } from "../../components/table/TableHeadCustom";
import useInvitationClient from "../../core/features/inviteClient/useInvitationClient";
import ClientInvitationForm from "../../components/forms/ClientInvitationForm";

const TABLE_HEAD: Array<HeadLabelCustom> = [
  { id: "nickname", label: "Name", align: "left", width: "205px" },
  {
    id: "email",
    label: "Email",
    align: "left"
  },
  {
    id: "Status",
    label: "status",
    align: "center"
  }
];

const TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "pause", label: "Pause" }
];

export default function ManageAccount() {
    const { error, loading: inviting, inviteClient } = useInvitationClient();
    
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs("all");
  const [filterName, setFilterName] = useState("");
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  
  const handleSubmit = async (data: { fullName: string; email: string }) => {
    await inviteClient(data);
    closeModal()
  };

  return (
    <Page title="Manage Account">
      <Container>
        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: "background.neutral" }}>
            {TABS.map((tab) => (
              <Tab disableRipple key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          <Box sx={{ py: 2.5, px: 3, display: "flex", columnGap: "8px" }}>
            <TextField
              fullWidth
              value={filterName}
              onChange={(event) => setFilterName(event.target.value)}
              placeholder="Search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled", width: 20, height: 20 }}
                    />
                  </InputAdornment>
                )
              }}
            />
            <Button
              sx={{ whiteSpace: "nowrap" }}
              variant="contained"
              startIcon={
                <Iconify icon="eva:plus-fill" sx={{ color: "text.white", width: 20, height: 20 }} />
              }
              onClick={openModal}
              >
              New Client
            </Button>
          </Box>

          <DataTable
            data={[]}
            isNotFound={true}
            total={0}
            loading={false}
            headLabels={TABLE_HEAD}
            hint="Click any entry in the table to see details"
          />
        </Card>
        <Dialog
          open={modalIsOpen}
          onClose={closeModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContent>
            <ClientInvitationForm onSubmit={handleSubmit} loading={inviting} onCancel={closeModal} />
          </DialogContent>
        </Dialog>
      </Container>
    </Page>
  );
}
