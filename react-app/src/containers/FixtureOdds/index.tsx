import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";

import store, { RootState } from "../../state";
import { actions, getOdds, Odds } from "./state";

import { background } from "../../Theme";
import moment from "moment";
import { Filtering } from "../../components/Filtering";
import { Chart } from "./components/Chart";

type Props = {
  fixtureId: number;
};

const FixtureOdds: React.FC<Props> = ({ fixtureId }: Props) => {
  const { loading, error, data, hasMore } = useSelector(
    (state: RootState) => state.fixtureOdds
  );

  const dispatch = useDispatch();

  const [filterState, setFilterState] = useState({
    offset: 0,
    limit: 50,
    fromDate: moment().subtract(1, "M"),
    toDate: moment(),
    fixtureId,
    group: false,
  });

  const search = (offset: number) => {
    if (offset === 0) {
      dispatch(actions.resetState());
    }
    store.dispatch(
      getOdds({
        limit: 50,
        offset,
        fromDate: filterState.fromDate.unix() * 1000,
        toDate: filterState.toDate.unix() * 1000,
        fixtureId,
      })
    );
  };

  useEffect(() => {
    search(0);
    return () => {
      dispatch(actions.resetState());
    };
  }, []);

  const latestByBooky = useMemo(() => selectLatestByBooky(data), [data]);

  return (
    <Grid container p={2}>
      <Grid item xs={12} p={2}>
        <Typography variant="h3">Odds</Typography>
      </Grid>

      <Filtering
        filterState={filterState}
        setFilterState={setFilterState}
        searchFunction={search}
      />

      {error && (
        <Box sx={{ width: "100%", textAlign: "center", p: 3 }}>
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
            ...background,
            p: 2,
            textAlign: "center",
            width: "100%",
          }}
        >
          <CircularProgress size="100px" />{" "}
        </Box>
      )}

      {!error && !loading && data.length === 0 && (
        <Grid item xs={12} p={2}>
          <Box>
            <Typography>No odds available</Typography>
          </Box>
        </Grid>
      )}

      {data.length && (
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              background: "rgba(0,0,0,1)",
              p: 2,
              borderRadius: "10px",
            }}
          >
            <Typography sx={{ flex: "1" }}>bookmaker</Typography>
            <Typography sx={{ flex: "0.5" }}>oddstype</Typography>
            <Typography sx={{ flex: "2" }}>prices</Typography>
            <Typography sx={{ flex: "0.5" }}>time</Typography>
          </Box>
          {data.length > 0 && (
            <Box
              sx={{
                maxHeight: "700px",
                overflow: "scroll",
              }}
            >
              {/* <Chart data={mappedData} /> */}

              {(filterState.group ? latestByBooky : data).map((o) => {
                const changes = calcDelta(data, o);
                return (
                  <Grid item xs={12} p="5px">
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        px: 2,
                      }}
                    >
                      <Typography sx={{ flex: "1" }}>{o.booky.name}</Typography>
                      <Typography sx={{ flex: "0.5" }}>
                        {o.type.name}
                      </Typography>
                      <Box
                        sx={{
                          flex: "2",
                          display: "flex",
                        }}
                      >
                        {o.Price.map((p, idx) => {
                          const hasChanges = changes[idx];
                          const isNegative =
                            hasChanges != undefined &&
                            hasChanges.startsWith("-");

                          return (
                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                              }}
                            >
                              <Typography flex="1">
                                <b>{p.priceName.name} </b>
                                {p.value}
                              </Typography>

                              {hasChanges != undefined &&
                                hasChanges !== "0.00" && (
                                  <Typography
                                    sx={{
                                      flex: "0.3",
                                      fontSize: "8px",
                                      color: isNegative ? "red" : "green",
                                    }}
                                  >{`${
                                    isNegative ? "" : "+"
                                  } ${hasChanges}%`}</Typography>
                                )}
                            </Box>
                          );
                        })}
                        {o.type.id === 1 && (
                          <Typography sx={{ flex: 1 }}>
                            <>-</>
                          </Typography>
                        )}
                      </Box>
                      <Typography sx={{ flex: "0.5", fontSize: "10px" }}>
                        {moment(o.timestamp).format("DD/MM HH:mm:ss")}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
              {hasMore && (
                <Grid item xs={8} p="2" textAlign={"center"} m="auto">
                  <Button
                    onClick={() => {
                      search(data.length);
                    }}
                    variant="outlined"
                  >
                    {" "}
                    LOAD MORE
                  </Button>
                </Grid>
              )}
            </Box>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default FixtureOdds;

const selectLatestByBooky = (data: Odds[]): Odds[] => {
  const map = data.reduce((acc, o) => {
    const updated = { ...acc } as Record<number, Odds>;

    const value = updated[o.booky.id];

    if (
      !value ||
      value.timestamp ||
      new Date(o.timestamp) > new Date(value.timestamp)
    ) {
      updated[o.booky.id] = o;
    }

    return updated;
  }, {});

  return (Object.values(map) as Odds[]).sort((a, b) => {
    return new Date(b.timestamp) < new Date(a.timestamp) ? -1 : 1;
  });
};

// used to convert odds array to timeseries of odds by booky. Not usable as data too sparse.
const mapData = (data: Odds[]) => {
  if (!data.length) {
    return [];
  }

  const dates = data.map((d) => moment(d.timestamp).unix() * 1000);

  const latest = moment(Math.max(...dates));
  let currentDate = moment(Math.min(...dates));

  const mapped: Record<string, string | number[]>[] = [];

  const bookies = [...new Set(data.map((o) => o.booky.name))];

  // interpolate dates
  while (currentDate < latest) {
    const onThisDate = data.filter(
      (o) =>
        moment(o.timestamp).format("YY-MM-DD-HH") ===
        currentDate.format("YY-MM-DD-HH")
    );


    const nowByBooky = bookies.reduce(
      (acc, booky) => {
        const n = { ...acc };

        n[booky] =
          onThisDate
            .find((o) => o.booky.name === booky)
            ?.Price.map((p) => p.value) || [];

        return n;
      },
      { date: currentDate.format("YYYY-MM-DD-HH") } as {
        [key: string]: string | number[];
      }
    );

    currentDate = moment(currentDate.add(1, "h"));

    mapped.push(nowByBooky);
  }

  return mapped;
};

const calcDelta = (data: Odds[], point: Odds) => {
  return point.Price.map((p, idx) => {
    const found = data.find(
      (d) =>
        new Date(d.timestamp) < new Date(point.timestamp) &&
        d.booky.id === point.booky.id &&
        d.Price[idx] !== undefined &&
        d.type.id === point.type.id
    );

    if (!found) {
      return null;
    }

    const diff = p.value - found.Price[idx].value;
    const pctChg = (diff / found.Price[idx].value) * 100;
    return pctChg.toFixed(2);
  });
};
