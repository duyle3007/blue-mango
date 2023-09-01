import { Box, Button, Popover, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import Iconify from "../../components/Iconify";

interface SymptomsSelectorProps {
  options?: Array<{ value: string; label: string }>;
  onChange?: (topics: string[]) => void;
}

const SelectorAction = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.grey["200"],
  borderRadius: "8px",
  overflow: "hidden",
  width: "fit-content",
  padding: "3px 8px",
  cursor: "pointer",
  border: "none"
}));

const OptionBox = styled(Box)<{ active: boolean }>(({ theme, active }) => ({
  display: "flex",
  width: "200px",
  minHeight: "46px",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(145, 158, 171, 0.32)",
  borderRadius: "8px",
  cursor: "pointer",
  backgroundColor: active ? theme.palette.primary.main : theme.palette.common.white,
  color: active ? theme.palette.common.white : theme.palette.common.black
}));

export default function SymptomsSelector(props: SymptomsSelectorProps) {
  const { onChange } = props;
  const options = [
    { value: "dizziness", lable: "Dizziness" },
    { value: "nausea", lable: "Nausea" },
    { value: "tunnel_vision", lable: "Tunnel vision" },
    { value: "unpleasant_hearing_sensitive", lable: "Hearing Sensitivity" },
    { value: "trembling_body", lable: "Trembling" }
  ];
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const [label, setLabel] = useState("All Symptoms");
  const [currentTopics, setCurrentTopics] = useState<string[]>([]);

  const toogleTopic = useCallback(
    (topic: string) => {
      const setTopics = new Set(currentTopics);

      if (setTopics.has(topic)) {
        setTopics.delete(topic);
      } else {
        setTopics.add(topic);
      }

      setCurrentTopics(() => Array.from(setTopics));
    },
    [currentTopics]
  );

  useEffect(() => {
    if (currentTopics.length === 0 || currentTopics.length === options.length) {
      setLabel("All Symptoms");
    } else {
      if (currentTopics.length > 1) {
        setLabel(`${currentTopics.length} Symptoms`);
      } else {
        setLabel(`${currentTopics.length} Symptom`);
      }
    }
  }, [currentTopics]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clearTopics = () => {
    setCurrentTopics([])
    handleClose()
    onChange?.([])
  }

  const applyTopics = useCallback(() => {
    handleClose()
    onChange?.(currentTopics)
  }, [currentTopics])

  return (
    <>
      <SelectorAction onClick={handleClick}>
        <Typography variant="subtitle2">{label}</Typography>
        <Iconify icon={"eva:chevron-down-fill"} />
      </SelectorAction>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}>
        <Box sx={{ padding: "20px", rowGap: "10px", display: "flex", flexDirection: "column" }}>
          {options.map((option) => (
            <OptionBox
              key={option.lable}
              active={currentTopics.includes(option.value)}
              onClick={() => toogleTopic(option.value)}>
              <Typography variant="body1">{option.lable}</Typography>
            </OptionBox>
          ))}
          <Box sx={{ display: "flex", justifyContent: 'flex-end', columnGap: "10px" }}>
            <Button variant="text" onClick={clearTopics}>Clear</Button>
            <Button variant="contained" onClick={applyTopics}>Apply</Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
