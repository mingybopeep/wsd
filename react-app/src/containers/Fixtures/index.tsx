import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Drawer,
} from "@mui/material";

import store, { RootState } from "../../state";
import { actions, getFixtures, GetFixturesParams } from "./state";

import { background } from "../../Theme";
import moment from "moment";
import styled from "styled-components";
import FixtureOdds from "../FixtureOdds";
import { Filtering } from "../../components/Filtering";

export default function Fixtures() {
  const { loading, error, data } = useSelector(
    (state: RootState) => state.fixtures
  );

  const [filterState, setFilterState] = useState({
    offset: 0,
    limit: 50,
    fromDate: moment().subtract(1, "M"),
    toDate: moment(),
    searchTerm: "",
  });

  const dispatch = useDispatch();

  const search = (offset: number) => {
    store.dispatch(
      getFixtures({
        limit: 50,
        offset: offset || filterState.offset,
        searchTerm: filterState.searchTerm,
        fromDate: filterState.fromDate.unix() * 1000,
        toDate: filterState.toDate.unix() * 1000,
      })
    );
  };

  useEffect(() => {
    search(0);
    return () => {
      dispatch(actions.resetState());
    };
  }, []);

  const [selectedFixture, setSelectedFixture] = useState<number>(0);

  return (
    <Grid container>
      <Grid item xs={12} p={2}>
        <Typography variant="h3">Fixtures</Typography>
      </Grid>

      <Filtering
        filterState={filterState}
        setFilterState={setFilterState}
        searchFunction={search}
      />

      {error && (
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Alert severity="error">
            <AlertTitle color="red">Error loading fixtures</AlertTitle>
          </Alert>
          <Button variant="contained" onClick={() => search(0)}>
            retry
          </Button>
        </Box>
      )}

      {loading && (
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            width: "100%",
          }}
        >
          <CircularProgress size="100px" />{" "}
        </Box>
      )}

      {!loading && data.length === 0 && (
        <Grid item xs={12} p={2}>
          <Box>
            <Typography>No fixtures available</Typography>
          </Box>
        </Grid>
      )}

      {data.length > 0 && (
        <>
          {data.map((d) => {
            return (
              <Grid
                item
                xs={4}
                p="5px"
                onClick={() => setSelectedFixture(d.id)}
              >
                <Box
                  sx={{
                    borderRadius: "10px",
                    p: "20px",
                    width: "100%",
                    background: "rgba(100,100,100,0.05)",
                    "&:hover": {
                      background: "rgba(100,100,100,0.2)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Typography variant="h5">{d.competition}</Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                    }}
                  >
                    <Typography>
                      {d.home} v. {d.away}
                    </Typography>
                  </Box>

                  <TimeCell startTime={d.startTime} location={d.countryName} />
                </Box>
              </Grid>
            );
          })}
        </>
      )}

      <Drawer
        sx={{
          background: "rgba(0,0,0,0.8)",
        }}
        anchor={"bottom"}
        open={Boolean(selectedFixture)}
        onClose={() => setSelectedFixture(0)}
      >
        <FixtureOdds fixtureId={selectedFixture} />
      </Drawer>
    </Grid>
  );
}

const StatusDot = styled.div<{ $live?: boolean }>`
  && {
    width: 10px;
    height: 10px;
    margin: 10px;
    border-radius: 5px;
    background: ${(props) => (props.$live ? "green" : "blue")};
  }
`;

const TimeCell: React.FC<{ startTime: Date; location: string }> = ({
  startTime,
  location,
}: {
  startTime: Date;
  location: string;
}) => {
  const started = new Date(startTime) < new Date();
  const duration = moment.duration(moment().diff(startTime)).humanize();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <StatusDot />
      <Typography fontSize={"10px"}>
        {`${started ? "started" : "begins in "} ${duration}, in ${location}`}
      </Typography>
    </Box>
  );
};
