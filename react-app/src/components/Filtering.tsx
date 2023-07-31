import { Box, Button, Checkbox, FormLabel, TextField } from "@mui/material";
import moment, { Moment } from "moment";
import { useState } from "react";

type Props = {
  searchFunction: (args: any) => void;
  setFilterState: (args: any) => void;
  filterState: {
    limit: number;
    offset: number;
    searchTerm?: string;
    fromDate: Moment;
    toDate: Moment;
    group?: boolean;
  };
};
export const Filtering = ({
  searchFunction,
  filterState,
  setFilterState,
}: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        display: "flex",
        background: "rgba(100,100,255, 0.2)",
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          p: 2,
        }}
      >
        <TextField
          id="datetime-local"
          label="From date"
          type="datetime-local"
          value={filterState.fromDate.format("YYYY-MM-DDThh:mm")}
          onChange={(d) =>
            setFilterState({
              ...filterState,
              fromDate: moment(d.target.value),
            })
          }
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box
        sx={{
          p: 2,
        }}
      >
        <TextField
          id="datetime-local"
          label="To date"
          type="datetime-local"
          value={moment(filterState.toDate).format("YYYY-MM-DDThh:mm")}
          onChange={(d) =>
            setFilterState({
              ...filterState,
              toDate: moment(d.target.value),
            })
          }
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      {filterState.searchTerm !== undefined && (
        <Box p={2}>
          <TextField
            label="search"
            value={filterState.searchTerm}
            onChange={(e) =>
              setFilterState({ ...filterState, searchTerm: e.target.value })
            }
          />
        </Box>
      )}

      {filterState.group !== undefined && (
        <Box p={2}>
          <FormLabel>Group data</FormLabel>
          <Checkbox
            checked={filterState.group}
            onChange={(e) =>
              setFilterState({ ...filterState, group: !filterState.group })
            }
          />
        </Box>
      )}

      <Box p={2}>
        <Button variant="outlined" onClick={() => searchFunction(0)}>
          APPLY
        </Button>
      </Box>
    </Box>
  );
};
