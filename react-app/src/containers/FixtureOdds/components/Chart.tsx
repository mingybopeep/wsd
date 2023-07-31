import { Box, Typography } from "@mui/material";
import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: {
    value: number;
    fill: string;
    dataKey: string;
    name: string;
  }[];
  label: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <Box
        p={2}
        sx={{
          background: "rgba(0,0,10,0.8)",
        }}
      >
        {payload.map((pld) => (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>{pld.name}</Typography>
            <Box sx={{ display: "flex", alignContent: "center" }}>
              <Typography>{pld.value} </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return null;
};

export const Chart = ({
  data,
}: {
  data: {
    [key: string]: string | number[];
  }[];
}) => {
  console.log(data);
  return (
    <Box
      sx={{ width: "100%", height: "400px", background: "rgba(10,10,10,0.8)" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={data}>
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip />} />

          {data.map((d) =>
            Object.keys(d).map((booky) => {
              if (typeof d[booky] !== "number") {
                return;
              }

              console.log({ b: d.booky });

              // @ts-ignore
              return d[booky].map((p) => {
                return (
                  <Line
                    strokeWidth="2"
                    dot={false}
                    name={booky}
                    type="monotone"
                    dataKey={booky}
                    stroke="rgb(255,0,0)"
                  />
                );
              });
            })
          )}

          {/* <Line
            strokeWidth="2"
            dot={false}
            name="Tips"
            type="monotone"
            dataKey="tip"
            stroke="rgb(100,0,255)"
          />
          <Line
            strokeWidth="2"
            dot={false}
            name="DMs"
            type="monotone"
            dataKey="dm"
            stroke="rgb(50,0,255)"
          />
          <Line
            strokeWidth="2"
            dot={false}
            name="Subscriptions"
            type="monotone"
            dataKey="subs"
            stroke="rgb(230,0,100)"
          /> */}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
