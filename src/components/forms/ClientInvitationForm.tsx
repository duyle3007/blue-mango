import { Button, Grid, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import LoadingButton from '@mui/lab/LoadingButton';

type FormValues = {
  fullName: string;
  email: string;
};

interface ClientInvitationFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function ClientInvitationForm(
  props: ClientInvitationFormProps
) {
  const { onSubmit, onCancel, loading = false } = props;
  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const submit = (data: FormValues) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const cancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom mb={4}>Do you want to invite client ?</Typography>

      <form onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12}>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} label="Full Name" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} label="Email" fullWidth />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={6}>
            <Button variant="outlined" size="large" fullWidth onClick={cancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <LoadingButton variant="contained" type="submit" size="large" fullWidth loading={loading}>
              Invite
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
