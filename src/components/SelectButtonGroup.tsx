import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

interface SelectButtonGroupProps {
  options?: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
}

const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  backgroundColor: theme.palette.grey["200"],
  borderRadius: "8px",
  overflow: "hidden",
  width: "fit-content"
}));

const Button = styled("div")<{ active: boolean }>(({ theme, active }) => {
  return {
    padding: "4px 10px",
    backgroundColor: theme.palette.grey["200"],
    cursor: "pointer",
    ...(active
      ? {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          borderRadius: "8px"
        }
      : {}),
    "&:not(:last-child)": {
      borderRight: "1px solid #9e9eab3d"
    }
  };
});

export default function SelectButtonGroup(props: SelectButtonGroupProps) {
  const { value, options = [], onChange } = props;
  const [selectedValue, setSeletedValue] = useState<string>(value ?? "");

  useEffect(() => {
    onChange?.(selectedValue);
  }, [selectedValue]);

  return (
    <ButtonGroup>
      {options?.map((opt) => (
        <Button
          key={opt.value}
          onClick={() => setSeletedValue(opt.value)}
          active={selectedValue === opt.value}>
          {opt.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
