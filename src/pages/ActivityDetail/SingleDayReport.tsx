import { useEffect, useMemo, useState } from "react";
import getClientReportByDay, {
  GetReportByDayResponse,
  GetReportByDayResponseQuestionTag,
  GetReportByDayResponseQuestionType
} from "../../core/features/getClientReportByDay";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  LinearProgress,
  Rating,
  Typography,
  alpha,
  styled
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { fDate, fSecondToHHMMSS, fStringToDate } from "../../utils/formatTime";
import useAsync from "../../hooks/useAsync";
import getClientProfile, { ClientInfoResponse } from "../../core/features/getClientProfile";

interface SingleDayReportProps {
  clientId?: string;
  date?: string;
  maxListeningTimePerDay?: number;
}

const GroupCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3)
}));

const CustomChip = styled(Chip)(({ theme, color }) => ({
  color: theme.palette[color as string].dark,
  backgroundColor: alpha(theme.palette[color as string].main, 0.16)
}));

function mapTopicToLable(value: string) {
  switch (value) {
    case "seperation_thought":
      return "Separation from thoughts";
    case "mind_quieter":
      return "Quiet mind";
    case "awareness_body":
      return "Increased body awareness";
    case "unpleasant_hearing_sensitive":
      return "Hearing Sensitivity";
    case "trembling_body":
      return "Trembling";
    case "tunnel_vision":
      return "Tunnel Vision";
    case "nausea":
      return "Nausea";
    case "dizziness":
      return "Dizzyness";
    case "sleep":
      return "Sleep";
    case "energy":
      return "Energy";
    case "anxiety":
      return "Anxiety";
    default:
      return "";
  }
}

export default function SingleDayReport(props: SingleDayReportProps) {
  const { clientId = "", date = "", maxListeningTimePerDay = 0 } = props;
  const [comments, setComments] = useState<string[]>([]);
  const [adverseReactions, setAdverseReactions] = useState<string[]>([]);
  const [positiveReactions, setPositiveReactions] = useState<string[]>([]);
  const [healthInfos, setHealthInfos] = useState<Record<string, number>[]>([]);

  const [profile, profileLoading, getProfile] = useAsync<
    ClientInfoResponse | null,
    Parameters<typeof getClientProfile>
  >(getClientProfile);

  const [sessions, sessionsLoading, getSession] = useAsync<
    GetReportByDayResponse | null,
    Parameters<typeof getClientReportByDay>
  >(getClientReportByDay);

  const collectComment = (session: GetReportByDayResponse[number]) => {
    setComments((prev) => [...prev, ...session.comments.map((item) => item.content)]);
  };
  const collectAdverseReactions = (session: GetReportByDayResponse[number]) => {
    setAdverseReactions((prev) => {
      const setReaction = new Set(prev);
      session.questions.forEach((item) => {
        if (item.question.tags.includes(GetReportByDayResponseQuestionTag.NEGATIVE)) {
          setReaction.add(item.question.topic);
        }
      });

      return [...setReaction];
    });
  };

  const collectPositiveReactions = (session: GetReportByDayResponse[number]) => {
    setPositiveReactions((prev) => {
      const setReaction = new Set(prev);
      session.questions.forEach((item) => {
        if (item.question.tags.includes(GetReportByDayResponseQuestionTag.POSITIVE)) {
          setReaction.add(item.question.topic);
        }
      });

      return [...setReaction];
    });
  };

  const collectHealthInfo = (session: GetReportByDayResponse[number]) => {
    const healthInfo: Record<string, number> = {};

    session.questions.forEach((item) => {
      if (
        item.question.tags.includes(GetReportByDayResponseQuestionTag.HEALTH) &&
        item.question.type === GetReportByDayResponseQuestionType.RATING
      ) {
        healthInfo[item.question.topic] = Number(item.answer);
      }
    });

    setHealthInfos((prev) => [...prev, healthInfo]);
  };

  useEffect(() => {
    sessions?.forEach((session) => {
      collectComment(session);
      collectAdverseReactions(session);
      collectPositiveReactions(session);
      collectHealthInfo(session);
    });
  },[sessions])

  useEffect(() => {
    getProfile(clientId)
    getSession(clientId, date)
  }, []);

  const reportDate = useMemo(() => fDate(fStringToDate(date)), [date]);
  const sessionNumber = sessions?.length;
  const interruptions = useMemo(
    () => sessions?.reduce((sum, item) => sum + item.interruptions, 0),
    [sessions]
  );
  const pauseTime = useMemo(() => sessions?.reduce((sum, item) => sum + item.pause, 0) ?? 0, [sessions]);
  const duration = useMemo(
    () => sessions?.reduce((sum, item) => sum + item.duration, 0) ?? 0,
    [sessions]
  );
  const listeningTimeProgress = useMemo(
    () => (duration / maxListeningTimePerDay) * 100,
    [duration, maxListeningTimePerDay]
  );
  const healthInfoAggregation = useMemo(() => {
    const result = healthInfos.reduce(
      (acc: Record<string, number>, item: Record<string, number>) => {
        const keys = Object.keys(item);
        keys.forEach((key) => {
          if (!acc[key]) acc[key] = 0;
          acc[key] += item[key] ?? 0;
        });
        return acc;
      },
      {}
    );

    return Object.keys(result).map((key) => {
      const avg = Math.round((result[key] / healthInfos.length) * 100) / 100;
      const name = mapTopicToLable(key);

      return {
        name,
        value: avg
      };
    });
  }, [healthInfos]);

  const loading = profileLoading || sessionsLoading

  return (
    <>
      {loading && (
        <Box padding={5} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <>
          <Box mb={5}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {profile?.nickname} - {reportDate}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", rowGap: 5 }}>
            <GroupCard>
              <Box mb={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Listening time
                  </Typography>
                  <Box display="flex">
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {fSecondToHHMMSS(duration)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 1 }} color="GrayText">
                      / {fSecondToHHMMSS(maxListeningTimePerDay)}
                    </Typography>
                  </Box>
                </Box>

                <LinearProgress variant="determinate" value={listeningTimeProgress} />
              </Box>

              <Box sx={{ display: "flex" }}>
                <Box flex={1}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Sessions
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {sessionNumber}
                  </Typography>
                </Box>

                <Box flex={1}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Interruptions
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {interruptions}
                  </Typography>
                </Box>

                <Box flex={1}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Time on pause
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {fSecondToHHMMSS(pauseTime)}
                  </Typography>
                </Box>
              </Box>
            </GroupCard>

            {adverseReactions.length > 0 && (
              <GroupCard>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Adverse Reactions
                </Typography>

                <Box sx={{ display: "flex", columnGap: 1 }}>
                  {adverseReactions.map((value) => (
                    <CustomChip key={value} label={mapTopicToLable(value)} color="error" />
                  ))}
                </Box>
              </GroupCard>
            )}

            {positiveReactions.length > 0 && (
              <GroupCard>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Positive Observations
                </Typography>

                <Box sx={{ display: "flex", columnGap: 1 }}>
                  {positiveReactions.map((value) => (
                    <CustomChip key={value} label={mapTopicToLable(value)} color="success" />
                  ))}
                </Box>
              </GroupCard>
            )}

            <GroupCard>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Health
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                {healthInfoAggregation.map((item) => (
                  <Box key={item.name} flex={1}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Rating
                      name={item.name}
                      defaultValue={item.value}
                      precision={0.5}
                      readOnly
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                  </Box>
                ))}
              </Box>
            </GroupCard>

            {comments.map((comment, index) => (
              <GroupCard key={index}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Comment {index + 1}
                </Typography>

                <Typography variant="body1">{comment}</Typography>
              </GroupCard>
            ))}
          </Box>
        </>
      )}
    </>
  );
}
