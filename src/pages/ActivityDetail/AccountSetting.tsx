import { useEffect, useState } from "react";
import getClientProfile, { ClientInfoResponse } from "../../core/features/getClientProfile";
import useAsync from "../../hooks/useAsync";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import updateClientProfile, {
  UpdateClientProfileResponse
} from "../../core/features/updateClientProfile";

interface AccountSettingProps {
  clientId?: string;
  clientName?: string;
}

export default function AccountSetting(props: AccountSettingProps) {
  const { clientId, clientName } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [profile, loading, execute] = useAsync<
    ClientInfoResponse | null,
    Parameters<typeof getClientProfile>
  >(getClientProfile);

  const [updatedProfile, isSaving, executeSaving] = useAsync<
    UpdateClientProfileResponse | null,
    Parameters<typeof updateClientProfile>
  >(updateClientProfile);

  useEffect(() => {
    if (clientId) {
      execute(clientId);
    }
  }, [clientId]);

  useEffect(() => {
    setName(updatedProfile?.nickname ?? profile?.nickname ?? "");
    setEmail(updatedProfile?.email ?? profile?.email ?? "");
  }, [profile, updatedProfile]);

  const onSave = () => {
    if (clientId) {
      executeSaving(clientId, {
        name
      });
    }
  };

  return (
    <>
      <Box mb={5}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {name || clientName}
        </Typography>
      </Box>

      {loading && (
        <Box padding={5} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Box sx={{ width: "458px" }}>
          <Box mb={4}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);
              }}
            />
          </Box>

          <Box mb={4}>
            <TextField
              fullWidth
              disabled
              label="Email"
              value={email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value);
              }}
            />
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={onSave}
              loading={isSaving}
              disabled={isSaving}>
              Save
            </LoadingButton>
          </Box>
        </Box>
      )}
    </>
  );
}
