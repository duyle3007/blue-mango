import {
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  DAY_LIMIT_DEFAULT,
  DAY_LIMIT_OPTIONS,
  SESSION_LIMIT_DEFAULT,
  SESSION_LIMIT_OPTIONS
} from "../../core/constants/config";
import { fSecondToHHMMSS } from "../../utils/formatTime";
import getCourse from "../../core/features/getCourse";
import useAsync from "../../hooks/useAsync";
import patchCourse, { PathCoursePayload } from "../../core/features/patchCourse";
import { LoadingButton } from "@mui/lab";
import getClientProfile, { ClientInfoResponse } from "../../core/features/getClientProfile";

interface TimeLimitsProps {
  clientName?: string;
  clientId?: string;
}

export default function TimeLimits(props: TimeLimitsProps) {
  const { clientName, clientId = '' } = props;
  const [sessionLimit, setSessionLimit] = useState<number>(SESSION_LIMIT_DEFAULT);
  const [dayLimit, setDayLimit] = useState<number>(DAY_LIMIT_DEFAULT);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [savedCourse, isSaving, excuteSaveCourse] = useAsync<PathCoursePayload | null, Parameters<typeof patchCourse>>(patchCourse)
  const [restoredCourse, isRestoring, excuteRestoreCourse] = useAsync<PathCoursePayload | null, Parameters<typeof patchCourse>>(patchCourse)
  const [resetedCourse, isReseting, excuteResetCourse] = useAsync<PathCoursePayload | null, Parameters<typeof patchCourse>>(patchCourse)
  const [profile, profileLoading, getProfile] = useAsync<
    ClientInfoResponse | null,
    Parameters<typeof getClientProfile>
  >(getClientProfile);

  const handleChangeSessionLimit = (event: SelectChangeEvent) => {
    setSessionLimit(Number(event.target.value));
  };

  const handleChangeDayLimit = (event: SelectChangeEvent) => {
    setDayLimit(Number(event.target.value));
  };

  useEffect(() => {
    getProfile(clientId)
    const init = async () => {
      const courseResponse = await getCourse(clientId);
      if (courseResponse) {
        const { maxTimePerDay, maxTimePerSession, totalTime } = courseResponse;
        setSessionLimit(maxTimePerSession / 3600);
        setDayLimit(maxTimePerDay / 60);
        setTotalTime(totalTime);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (resetedCourse) {
      const { totalTime = 0 } = resetedCourse;
      setTotalTime(totalTime);
    }
  }, [resetedCourse])

  useEffect(() => {
    if (savedCourse) {
      const { maxTimePerDay = DAY_LIMIT_DEFAULT * 60, maxTimePerSession = SESSION_LIMIT_DEFAULT * 3600 } = savedCourse;
      setSessionLimit(maxTimePerSession / 3600);
      setDayLimit(maxTimePerDay / 60);
    }
  }, [savedCourse])

  useEffect(() => {
    if (restoredCourse) {
      const { maxTimePerDay = DAY_LIMIT_DEFAULT * 60, maxTimePerSession = SESSION_LIMIT_DEFAULT * 3600 } = restoredCourse;
      setSessionLimit(maxTimePerSession / 3600);
      setDayLimit(maxTimePerDay / 60);
    }
  }, [restoredCourse])

  const onSave = () => {
    excuteSaveCourse(clientId, {
      maxTimePerDay: dayLimit * 60,
      maxTimePerSession: sessionLimit * 3600
    })
  }

  const onRestore = () => {
    excuteRestoreCourse(clientId, {
      maxTimePerDay: DAY_LIMIT_DEFAULT * 60,
      maxTimePerSession: SESSION_LIMIT_DEFAULT * 3600
    })
  }

  const onReset = () => {
    excuteResetCourse(clientId, {
      totalTime: 0,
      shouldReset: true
    })
  }

  const isDisable = isReseting || isRestoring || isSaving

  if (profileLoading)
  return (
    <Box padding={5} display="flex" justifyContent="center">
      <CircularProgress />
    </Box>
  );


  return (
    <>
      <Box mb={5}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {clientName}
        </Typography>
      </Box>

      <Box sx={{ width: "458px" }}>
        <FormControl fullWidth sx={{ marginBottom: 4 }}>
          <InputLabel>Session Limits (hours)</InputLabel>
          <Select
            value={String(sessionLimit)}
            label="Session Limits (hours)"
            onChange={handleChangeSessionLimit}>
            {SESSION_LIMIT_OPTIONS.map((value) => (
              <MenuItem key={value} value={value}>
                {value > 1 ? `${value} hours` : `${value} hour`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ marginBottom: 1 }}>
          <InputLabel>Day Limits (minutes)</InputLabel>
          <Select
            value={String(dayLimit)}
            label="Day Limits (minutes)"
            onChange={handleChangeDayLimit}>
            {DAY_LIMIT_OPTIONS.map((value) => (
              <MenuItem key={value} value={value}>
                {value} minutes
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mb={2}>
          <Typography variant="caption" sx={{ mb: 1, color: "text.secondary" }}>
            The session limit must not exceed the daily limit
          </Typography>
        </Box>

        <Box>
          <Box mb={3}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="subtitle2">Listening time</Typography>
              <Box display="flex">
                <Typography variant="subtitle2">{fSecondToHHMMSS(totalTime)}</Typography>
                <Typography variant="subtitle2" color="GrayText">
                  / {fSecondToHHMMSS(sessionLimit * 3600)}
                </Typography>
              </Box>
            </Box>

            <LinearProgress variant="determinate" value={totalTime / (sessionLimit * 36)} />
          </Box>
        </Box>

        <LoadingButton variant="outlined" color="primary" fullWidth onClick={onReset} loading={isReseting} disabled={isDisable || totalTime === 0}>
          Reset to zero
        </LoadingButton>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <LoadingButton variant="text" color="primary" onClick={onRestore} loading={isRestoring} disabled={isDisable}>
            Restore default
          </LoadingButton>

          <LoadingButton variant="contained" color="primary" onClick={onSave} loading={isSaving} disabled={isDisable}>
            Save
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
}
