import { Box, Container } from "@mui/material";
import { useParams } from "react-router-dom";
import Page from "../../components/Page";
import ActivitySidebar from "./ActivitySidebar";
import { useCallback, useEffect, useReducer, useState } from "react";
import getClientProfile from "../../core/features/getClientProfile";
import AdverseReactionHeatMap from "./AdverseReactionHeatMap";
import HealthInfoGraph from "./HealthInfoGraph";
import SingleDayReport from "./SingleDayReport";
import { NAVBAR } from "../../config";
import ListeningTimeHeatMap from "./ListeningTimeHeatMap";
import CommentHeatMap from "./CommentHeatMap";
import TimeLimits from "./TimeLimits";
import AccountSetting from "./AccountSetting";

interface IViewInfo {
  viewId: string;
  props?: Record<string, string | number>;
}
type ViewInfoReducer = (state: IViewInfo, action: IViewInfo) => IViewInfo;

export default function ActivityDetail() {
  const { userId } = useParams();
  const [viewInfo, setViewInfo] = useReducer<ViewInfoReducer>(
    (state, action) => {
      return Object.assign({}, state, action);
    },
    { viewId: "adverse_reaction", props: {} }
  );
  const [clientName, setClientName] = useState("");
  const [course, setCourse] = useState<{ maxTimePerDay: number }>({ maxTimePerDay: 0 });

  useEffect(() => {
    async function getClientInfo() {
      if (userId) {
        const data = await getClientProfile(userId);
        setClientName(data?.nickname ?? "");

        if (data?.course) {
          setCourse(data?.course);
        }
      }
    }
    getClientInfo();
  }, [userId]);

  const getViews = useCallback(
    (viewId: string, props?: Record<string, string | number>) => {
      switch (viewId) {
        case "adverse_reaction":
          return (
            <AdverseReactionHeatMap
              clientId={userId}
              onView={(payload) =>
                setViewInfo({ viewId: "single_day_report", props: { date: payload.date } })
              }
            />
          );
        case "health":
          return <HealthInfoGraph clientId={userId} />;
        case "single_day_report":
          return (
            <SingleDayReport
              clientId={userId}
              maxListeningTimePerDay={course.maxTimePerDay}
              date={props?.date as string}
            />
          );

        case "listening_time":
          return (
            <ListeningTimeHeatMap
              clientId={userId}
              onView={(payload) =>
                setViewInfo({ viewId: "single_day_report", props: { date: payload.date } })
              }
            />
          );
        case "comments":
          return (
            <CommentHeatMap
              clientId={userId}
              onView={(payload) =>
                setViewInfo({ viewId: "single_day_report", props: { date: payload.date } })
              }
            />
          );
        case "time_limits":
          return <TimeLimits clientId={userId} clientName={clientName} />;
        case "account_settings":
          return <AccountSetting clientId={userId} clientName={clientName} />;
        default:
          return <div>Comming soon</div>;
      }
    },
    [userId, clientName]
  );

  return (
    <Page title="Activity Detail">
      <Box display="flex">
        <ActivitySidebar onChange={(label) => setViewInfo({ viewId: label.id })} />
        <Box sx={{ width: `calc(100% - ${NAVBAR.BASE_WIDTH}px)` }}>
          <Container>{getViews(viewInfo.viewId, viewInfo.props)}</Container>
        </Box>
      </Box>
    </Page>
  );
}
