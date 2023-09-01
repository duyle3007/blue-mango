import {
  Box,
  Card,
  Container,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  debounce
} from "@mui/material";
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import useClients from "../../core/features/showClientList/useClients";
import DataTable, { TableChangeInfo } from "../../components/table/DataTable";
import { HeadLabelCustom } from "../../components/table/TableHeadCustom";
import useTabs from "../../hooks/useTabs";
import Label from "../../components/Label";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD: Array<HeadLabelCustom> = [
  { id: "name", label: "Name", align: "left", width: "205px" },
  {
    id: "listeningTime",
    label: " Listening Time \n(last 30 days)",
    align: "center"
  },
  {
    id: "adverseReactions",
    label: "Adverse Reactions \n(last 30 days)",
    align: "center"
  },
  { id: "unreadComments", label: "Unread Comments", align: "center" },
  {
    id: "requests",
    label: "Music Requests",
    align: "center"
  },
  {
    id: "limits",
    label: "Limits \n(Session, Day)",
    align: "center"
  }
];

const TABS = [
  { value: "all", label: "All" },
  { value: "adverseReactions", label: "Recent Adverse Reactions" },
  { value: "pendingMusicRequest", label: "New Music Requests" },
  { value: "unreadComments", label: "Unread Comments" }
];

export default function ActivityOverview() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tableInfo, setTableInfo] = useState<Partial<TableChangeInfo>>({});
  const { data, loading, total, getClients, isNotFound } = useClients();

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs("all");

  const customCells = useMemo(
    () => ({
      adverseReactions: (value: string | number) =>
        Number(value) > 0 ? <Label color="error">{value}</Label> : <Label>{value}</Label>,
      unreadComments: (value: string | number) =>
        Number(value) > 0 ? <Label color="warning">{value}</Label> : <Label>{value}</Label>,
      pendingMusicRequest: (value: string | number) =>
        Number(value) > 0 ? <Label color="success">{value}</Label> : <Label>{value}</Label>,
      limitSession: (value: string | number) => <Label color="info">{value}</Label>
    }),
    []
  );

  const clickRowHandler = (data: Record<string, string | number> & { id: string | number }) => {
    navigate(String(data.id));
  };

  const onTableChange = (infos: TableChangeInfo) => {
    getClients({
      limit: infos.limit,
      skip: infos.skip,
      query: search
    });
  };
  
  const debounceSearch = useCallback(
    debounce((searchString) => {
      getClients({
        limit: tableInfo.limit,
        skip: tableInfo.skip,
        query: searchString
      });
    }, 500),
    [tableInfo.limit, tableInfo.skip]
  );

  const onSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearch(event.target.value)
    debounceSearch(event.target.value)
  }

  useEffect(() => {
    setSearch("");
    getClients({
      filter: filterStatus
    });
  }, [filterStatus]);


  return (
    <Page title="Activity Overview">
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
          <Box sx={{ py: 2.5, px: 3 }}>
            <TextField
              fullWidth
              value={search}
              onChange={onSearch}
              placeholder="Search user by name..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon={"eva:search-fill"}
                      sx={{ color: "text.disabled", width: 20, height: 20 }}
                    />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <DataTable
            data={data}
            isNotFound={isNotFound}
            total={total}
            loading={loading}
            headLabels={TABLE_HEAD}
            customCells={customCells}
            onClickRow={clickRowHandler}
            hint="Click any entry in the table to see details"
            onChange={setTableInfo}
          />
        </Card>
      </Container>
    </Page>
  );
}
